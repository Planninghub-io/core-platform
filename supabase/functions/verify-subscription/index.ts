
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
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
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
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });
    
    if (session.payment_status !== 'paid') {
      throw new Error("Payment has not been completed");
    }
    
    // Map Stripe products to our plan IDs
    // In a production application, you'd store these mappings in a database
    const productToPlanMapping: Record<string, string> = {
      "prod_professional": "professional",
      "prod_enterprise": "enterprise"
    };
    
    // Determine which plan the user subscribed to
    const subscription = session.subscription as Stripe.Subscription;
    const items = subscription.items.data;
    
    if (items.length === 0) {
      throw new Error("No subscription items found");
    }
    
    // Extract the product ID from the subscription
    const productId = items[0].price.product as string;
    const planId = productToPlanMapping[productId] || "professional"; // Default to professional
    
    // Update the user's subscription details in the database
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        subscription_plan: planId,
        subscription_status: "active",
        subscription_id: subscription.id,
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq("id", user.id);
    
    if (updateError) {
      throw new Error(`Failed to update subscription: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verification error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
