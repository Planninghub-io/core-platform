
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    // Get the token from the header
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Parse the request body
    const { companyName, businessPhone, businessEmail } = await req.json();
    
    if (!companyName) {
      return new Response(
        JSON.stringify({ error: "Company name is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Create the company record
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert([
        {
          name: companyName,
          type: "vendor", // Default type
          business_phone: businessPhone || null,
          business_email: businessEmail || null,
        },
      ])
      .select()
      .single();
    
    if (companyError) {
      console.error("Company creation error:", companyError);
      return new Response(
        JSON.stringify({ error: "Failed to create company" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    // Create the user role for the company
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .insert([
        {
          user_id: user.id,
          company_id: companyData.id,
          role: "admin", // Default role for company creator
        },
      ])
      .select()
      .single();
    
    if (roleError) {
      console.error("Role creation error:", roleError);
      // Don't return an error here, as we don't want to fail the whole process
      // just because the role creation failed
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        company: companyData,
        role: roleData || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
