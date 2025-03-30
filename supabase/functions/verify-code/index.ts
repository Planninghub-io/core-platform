
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json() as VerifyCodeRequest;
    
    if (!email || !code) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get user by email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      throw userError;
    }
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return new Response(
        JSON.stringify({ 
          error: "User not found" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Check verification code
    const storedCode = user.user_metadata?.verification_code;
    const expiresAt = user.user_metadata?.verification_code_expires_at;
    
    if (!storedCode) {
      return new Response(
        JSON.stringify({ 
          error: "No verification code found. Please request a new code." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Check if code is expired
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return new Response(
        JSON.stringify({ 
          error: "Verification code has expired. Please request a new code." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Verify code
    if (storedCode !== code) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid verification code" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Mark email as verified and clear verification code
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          verification_code: null,
          verification_code_expires_at: null,
          email_verified: true
        }
      }
    );
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`Email verified for user: ${email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email verified successfully" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in verify-code function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
