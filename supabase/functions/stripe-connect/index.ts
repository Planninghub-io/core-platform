
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

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");
    
    console.log("Stripe Connect function called", { 
      hasCode: !!code, 
      hasError: !!error, 
      url: req.url,
      method: req.method,
      origin: url.origin
    });
    
    // Handle errors from Stripe OAuth redirect
    if (error) {
      console.error("Stripe OAuth error:", error, errorDescription);
      return Response.redirect(`${url.origin}/event-ticketing?stripe_error=${encodeURIComponent(errorDescription || error)}`);
    }
    
    // Check if this is a redirect from Stripe with an authorization code
    if (code) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
        
        if (!supabaseUrl || !supabaseServiceKey) {
          throw new Error("Missing Supabase credentials");
        }
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        console.log("Exchanging code for access token");
        
        // Exchange the authorization code for an access token
        const stripeConnectEndpoint = "https://connect.stripe.com/oauth/token";
        const clientId = Deno.env.get("STRIPE_CLIENT_ID") || "";
        const secretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
        
        if (!clientId || !secretKey) {
          throw new Error("Missing Stripe credentials");
        }
        
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
        
        console.log("Stripe account connected successfully");
        
        // Get user ID from the session
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
          // If no auth header, try to get from URL params for OAuth flow
          const state = url.searchParams.get("state");
          if (!state) {
            throw new Error("No user identification provided");
          }
          
          // In a production app, you would decode and validate the state parameter
          // For simplicity, we're assuming it contains the user ID
        }
        
        const token = authHeader ? authHeader.replace("Bearer ", "") : null;
        let userId;
        
        if (token) {
          // Get user from token if available
          const { data: userData, error: userError } = await supabase.auth.getUser(token);
          
          if (userError || !userData.user) {
            throw new Error("Failed to identify user from token");
          }
          
          userId = userData.user.id;
        } else {
          // If no token, try to get from cookies/session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !sessionData.session) {
            // Redirect to login with a return URL
            return Response.redirect(`${url.origin}/auth?returnTo=${encodeURIComponent(url.pathname + url.search)}`);
          }
          
          userId = sessionData.session.user.id;
        }
        
        // Save the Stripe account ID to the user's profile
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({ stripe_account_id: data.stripe_user_id })
          .eq("id", userId);
        
        if (updateError) {
          throw new Error("Failed to update user profile");
        }
        
        console.log("User profile updated with Stripe account ID");
        
        // Get return path from state or use default
        const returnPath = localStorage.getItem('stripeConnectReturnPath') || '/event-ticketing';
        
        // Redirect back to the application with success message
        return Response.redirect(`${url.origin}${returnPath}?stripe_success=true`);
      } catch (error) {
        console.error("Stripe Connect error:", error);
        return Response.redirect(`${url.origin}/event-ticketing?stripe_error=${encodeURIComponent(error.message)}`);
      }
    }
    
    // If no code is present, this is the initial request to generate a Stripe URL
    const stripeClientId = Deno.env.get("STRIPE_CLIENT_ID") || "";
    
    if (!stripeClientId) {
      throw new Error("Missing Stripe Client ID");
    }
    
    // Get the origin from the request
    const origin = url.origin;
    // Define a redirect URI that matches what you've set in your Stripe Connect settings
    const redirectUri = `${origin}/api/stripe-connect`;
    
    console.log("Generating Stripe Connect authorization URL", { 
      redirectUri,
      clientId: stripeClientId.substring(0, 5) + '...' // Log partial client ID for security
    });
    
    const stripeConnectUrl = new URL("https://connect.stripe.com/oauth/authorize");
    stripeConnectUrl.searchParams.append("client_id", stripeClientId);
    stripeConnectUrl.searchParams.append("response_type", "code");
    stripeConnectUrl.searchParams.append("redirect_uri", redirectUri);
    stripeConnectUrl.searchParams.append("scope", "read_write");
    
    console.log("Stripe Connect URL generated:", stripeConnectUrl.toString());
    
    // Return the URL as a JSON response instead of redirecting
    return new Response(
      JSON.stringify({ url: stripeConnectUrl.toString() }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Stripe Connect function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
