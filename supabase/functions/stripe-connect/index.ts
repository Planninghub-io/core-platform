
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  
  // Check if this is a redirect from Stripe with an authorization code
  if (code) {
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Exchange the authorization code for an access token
      const stripeConnectEndpoint = "https://connect.stripe.com/oauth/token";
      const clientId = Deno.env.get("STRIPE_CLIENT_ID") || "";
      const secretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
      
      const params = new URLSearchParams();
      params.append("client_secret", secretKey);
      params.append("code", code);
      params.append("grant_type", "authorization_code");
      
      const response = await fetch(stripeConnectEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error_description || "Failed to connect Stripe account");
      }
      
      // Get user ID from the session
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }
      
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        throw new Error("Failed to identify user");
      }
      
      // Save the Stripe account ID to the user's profile
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ stripe_account_id: data.stripe_user_id })
        .eq("id", userData.user.id);
      
      if (updateError) {
        throw new Error("Failed to update user profile");
      }
      
      // Redirect back to the application with success message
      return Response.redirect(`${url.origin}/event-ticketing?stripe_success=true`);
    } catch (error) {
      console.error("Stripe Connect error:", error);
      return Response.redirect(`${url.origin}/event-ticketing?stripe_error=${encodeURIComponent(error.message)}`);
    }
  }
  
  // If no code is present, this is the initial request to redirect to Stripe
  try {
    const stripeClientId = Deno.env.get("STRIPE_CLIENT_ID") || "";
    const redirectUri = `${url.origin}/api/stripe-connect`;
    
    const stripeConnectUrl = new URL("https://connect.stripe.com/oauth/authorize");
    stripeConnectUrl.searchParams.append("client_id", stripeClientId);
    stripeConnectUrl.searchParams.append("response_type", "code");
    stripeConnectUrl.searchParams.append("redirect_uri", redirectUri);
    stripeConnectUrl.searchParams.append("scope", "read_write");
    
    return Response.redirect(stripeConnectUrl.toString());
  } catch (error) {
    console.error("Stripe Connect initialization error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to initialize Stripe Connect" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
