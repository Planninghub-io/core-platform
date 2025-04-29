
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Production URL constant - ensure it's pointing to the actual application
const PRODUCTION_URL = 'https://yourplanner.ai';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body to get reset URL and email
    const body = await req.json();
    
    // Always use production URL for reset links - this doesn't actually control the redirection,
    // but is used as a visual URL in the email
    const resetUrl = `${PRODUCTION_URL}/auth/new-password`;
    
    const targetEmail = body.email || "";
    
    if (!targetEmail) {
      throw new Error("Email address is required");
    }
    
    console.log("Sending password reset email to:", targetEmail);
    console.log("With reset URL:", resetUrl);

    const emailResponse = await resend.emails.send({
      from: "PlannerAI <noreply@planninghub.io>",
      to: [targetEmail],
      subject: "Reset your PlannerAI password",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f8f9fa;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      text-align: center;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 30px;
      color: #8B5CF6;
      display: inline-block;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333333;
    }
    p {
      margin-bottom: 25px;
      font-size: 16px;
      color: #555555;
    }
    .button {
      display: inline-block;
      background-color: #8B5CF6;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      margin: 20px 0 30px 0;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #7C5AE0;
    }
    .note {
      font-size: 14px;
      color: #777777;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">PlannerAI</div>
    
    <h1>Reset your password</h1>
    
    <p>We received a request to reset your password. Click the button below to create a new password.</p>
    
    <a href="${resetUrl}" target="_blank" class="button">Reset Password</a>
    
    <p class="note">If you didn't request a password reset, you can safely ignore this email - nothing will be changed.</p>
    
    <div class="footer">
      &copy; 2025 PlannerAI. All rights reserved.
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
