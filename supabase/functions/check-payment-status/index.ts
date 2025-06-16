
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYMENT-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check setup fee payment status
    const { data: setupPayment } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("payment_type", "setup_fee")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let setupFeePaid = false;
    if (setupPayment && setupPayment.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(setupPayment.stripe_session_id);
      if (session.payment_status === "paid") {
        setupFeePaid = true;
        if (setupPayment.status !== "paid") {
          await supabaseClient
            .from("payments")
            .update({ status: "paid", updated_at: new Date().toISOString() })
            .eq("id", setupPayment.id);
        }
      }
    }

    // Check subscription status
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let subscriptionInfo = {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null
    };

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;

        let tier = null;
        if (amount === 299) tier = "lite";
        else if (amount === 599) tier = "pro";
        else if (amount === 999) tier = "business";

        subscriptionInfo = {
          subscribed: true,
          subscription_tier: tier,
          subscription_end: new Date(subscription.current_period_end * 1000).toISOString()
        };
      }

      // Update subscribers table
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed: subscriptionInfo.subscribed,
        subscription_tier: subscriptionInfo.subscription_tier,
        subscription_end: subscriptionInfo.subscription_end,
        setup_fee_paid: setupFeePaid,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    logStep("Payment status checked", { setupFeePaid, ...subscriptionInfo });

    return new Response(JSON.stringify({
      setup_fee_paid: setupFeePaid,
      ...subscriptionInfo
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-payment-status", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
