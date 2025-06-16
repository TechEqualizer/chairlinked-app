
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-COMBINED-PAYMENT] ${step}${detailsStr}`);
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

    // Check for Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not found");
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    logStep("Stripe key found");

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

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Define pricing based on tier
    const pricing = {
      lite: { amount: 299, name: "ChairLinked Lite" },
      pro: { amount: 599, name: "ChairLinked Pro" },
      business: { amount: 999, name: "ChairLinked Business" }
    };

    const selectedPlan = pricing[tier as keyof typeof pricing];
    logStep("Selected plan", selectedPlan);

    // Create a simplified combined checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "ChairLinked Setup Fee",
              description: "One-time setup fee for ChairLinked account"
            },
            unit_amount: 9700, // $97.00 in cents
          },
          quantity: 1,
        },
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
      success_url: `${req.headers.get("origin")}/payment-success?type=combined&tier=${tier}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        subscription_tier: tier,
        payment_type: "combined"
      }
    });

    logStep("Stripe session created successfully", { sessionId: session.id });

    // Record the payment attempt
    try {
      await supabaseClient.from("payments").insert({
        user_id: user.id,
        stripe_session_id: session.id,
        amount: 9700,
        payment_type: "setup_fee",
        status: "pending",
        created_at: new Date().toISOString()
      });
      logStep("Payment record created");
    } catch (dbError) {
      logStep("Warning: Failed to create payment record", { error: dbError });
      // Don't fail the entire request if DB insert fails
    }

    logStep("Returning session URL", { url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-combined-payment", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
