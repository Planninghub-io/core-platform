
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  isBusiness: boolean;
}

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

    // Here you'd normally use a service like Resend, SendGrid, etc.
    // For this example, we'll just log that we would send an email
    console.log(`Sending welcome email to ${email} (${firstName} ${lastName})`);
    console.log(`Account type: ${isBusiness ? 'Business' : 'Individual User'}`);
    
    // In a real implementation, you'd send an actual email like this:
    // const { data, error } = await resend.emails.send({
    //   from: 'EventIt <welcome@eventit.com>',
    //   to: [email],
    //   subject: 'Welcome to EventIt!',
    //   html: `
    //     <h1>Welcome to EventIt, ${firstName}!</h1>
    //     <p>Thank you for joining our platform. We're excited to help you ${isBusiness ? 'grow your business' : 'manage your events'}.</p>
    //     <p>If you have any questions, feel free to reply to this email.</p>
    //     <p>Best regards,<br>The EventIt Team</p>
    //   `,
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Welcome email would be sent to ${email}` 
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
