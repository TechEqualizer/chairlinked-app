
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const { tier } = await req.json();
    if (!tier || !['lite', 'pro', 'business'].includes(tier)) {
      throw new Error("Invalid subscription tier");
    }

    logStep("User authenticated", { userId: user.id, email: user.email, tier });

    // Check if user paid setup fee
    const { data: setupPayment } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("payment_type", "setup_fee")
      .eq("status", "paid")
      .single();

    if (!setupPayment) {
      logStep("User has not paid setup fee");
      return new Response(JSON.stringify({ error: "Setup fee must be paid first" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define pricing based on tier
    const pricing = {
      lite: { amount: 299, name: "ChairLinked Lite" },
      pro: { amount: 599, name: "ChairLinked Pro" },
      business: { amount: 999, name: "ChairLinked Business" }
    };

    const selectedPlan = pricing[tier as keyof typeof pricing];

    // Calculate billing cycle anchor for next month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const billingCycleAnchor = Math.floor(nextMonth.getTime() / 1000);

    logStep("Calculated billing cycle anchor", { 
      nextMonth: nextMonth.toISOString(), 
      billingCycleAnchor 
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPlan.name,
              description: `Monthly subscription for ${selectedPlan.name} plan`
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        billing_cycle_anchor: billingCycleAnchor,
      },
      success_url: `${req.headers.get("origin")}/payment-success?type=subscription&tier=${tier}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        subscription_tier: tier,
        billing_start: nextMonth.toISOString()
      }
    });

    logStep("Subscription session created", { 
      sessionId: session.id, 
      tier, 
      billingStart: nextMonth.toISOString() 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
