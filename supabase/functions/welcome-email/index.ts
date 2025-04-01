
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "npm:resend@2.0.0";

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

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Function to generate a random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    
    // Find the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      throw userError;
    }
    
    const user = userData.users.find(u => u.email === email);
    
    if (!user || !user.id) {
      throw new Error("User not found");
    }
    
    // Store the verification code in user metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
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
    
    // Prepare user name for email
    const userName = firstName || user.user_metadata?.first_name || 'there';
    
    // Send verification email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'EventIt <onboarding@resend.dev>', // Update with your verified domain when available
      to: [email],
      subject: 'Verify Your Email - EventIt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4F46E5; text-align: center;">Welcome to EventIt!</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
          <div style="background-color: #f5f5f5; padding: 12px; text-align: center; margin: 20px 0; border-radius: 6px;">
            <h2 style="letter-spacing: 5px; font-size: 32px; margin: 0;">${verificationCode}</h2>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't sign up for EventIt, you can safely ignore this email.</p>
          <p>Best regards,<br>The EventIt Team</p>
        </div>
      `,
    });
    
    if (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
    
    console.log(`Verification email sent to ${email} with code: ${verificationCode}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verification email sent to ${email}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
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
