
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Missing Stripe secret key");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    // Get the request body
    const { planId } = await req.json();
    
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    
    // Get the current user from the auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing auth header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Failed to identify user");
    }
    
    const user = userData.user;
    
    // Define prices for plans
    const planPrices = {
      basic: { amount: 0, name: "Basic Plan" },
      professional: { amount: 2900, name: "Professional Plan" },
      enterprise: { amount: 9900, name: "Enterprise Plan" }
    };
    
    const selectedPlan = planPrices[planId as keyof typeof planPrices];
    if (!selectedPlan) {
      throw new Error("Invalid plan ID");
    }
    
    // For free plans, just update the user's subscription status in the database
    if (selectedPlan.amount === 0) {
      // Update user's subscription in the database
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ 
          subscription_plan: planId,
          subscription_status: "active" 
        })
        .eq("id", user.id);
      
      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Free plan activated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user already has a Stripe customer ID
    let { data: profileData } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();
    
    let customerId = profileData?.stripe_customer_id;
    
    // If no customer ID exists, create a new Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name,
        metadata: {
          supabase_id: user.id
        }
      });
      
      customerId = customer.id;
      
      // Save the customer ID to the user's profile
      await supabase
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }
    
    // Get the origin to set success and cancel URLs
    const url = new URL(req.url);
    const origin = url.origin.replace('.supabase.co/functions/v1/stripe-checkout', '');
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings/billing?payment_cancelled=true`,
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
