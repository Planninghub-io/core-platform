
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  isBusiness?: boolean;
}

// Function to generate a random 5-digit code
const generateVerificationCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, isBusiness } = await req.json() as WelcomeEmailRequest;
    
    if (!email) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameter: email" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();
    
    // Create a Supabase client with the service role key
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
    
    // Store the verification code in user metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      (await supabaseAdmin.auth.admin.listUsers()).users.find(u => u.email === email)?.id || '',
      {
        user_metadata: { 
          verification_code: verificationCode,
          verification_code_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        }
      }
    );
    
    if (updateError) {
      console.error("Error storing verification code:", updateError);
      throw updateError;
    }
    
    // Here you'd normally use a service like Resend, SendGrid, etc.
    // For this example, we'll just log the verification code
    console.log(`Sending verification email to ${email} with code: ${verificationCode}`);
    console.log(`Account type: ${isBusiness ? 'Business' : 'Individual User'}`);
    
    // In a real implementation, you'd send an actual email like this:
    // const { data, error } = await resend.emails.send({
    //   from: 'EventIt <verify@eventit.com>',
    //   to: [email],
    //   subject: 'Verify Your Email - EventIt',
    //   html: `
    //     <h1>Verify Your Email</h1>
    //     <p>Thank you for signing up! Please enter the following verification code to complete your registration:</p>
    //     <h2 style="letter-spacing: 5px; font-size: 32px; background-color: #f5f5f5; padding: 10px; text-align: center;">${verificationCode}</h2>
    //     <p>This code will expire in 30 minutes.</p>
    //     <p>Best regards,<br>The EventIt Team</p>
    //   `,
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verification email sent to ${email}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in welcome-email function:", error);
    
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
