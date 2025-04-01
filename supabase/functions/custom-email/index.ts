import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the email template from Supabase Auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }

    // This endpoint allows you to customize the email templates used for password resets
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/email-templates`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          // Update the template configuration for password reset emails
          "action_link": {
            "email_subject": "Reset your account password",
            "email_from_name": "Planning Hub Team"
          },
          // Customize the recovery (password reset) template
          "recovery": {
            "email_subject": "Reset your account password",
            "email_from_name": "Planning Hub Team",
            "email_from_email": "onboarding@resend.dev",
            "template_html": `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your account password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      display: block;
      margin: 20px auto;
      max-width: 200px;
    }
    .button {
      display: inline-block;
      background-color: #8B5CF6;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <img src="https://nice-moss-0d3d9cf0f.5.azurestaticapps.net/lovable-uploads/c030d16e-cbcf-4be4-befd-81d2328d13e1.png" alt="Planning Hub Logo" class="logo">
  
  <p>Dear {{ .Email }},</p>
  
  <p>We've received your request to reset your password. Please click the link below to complete the reset.</p>
  
  <p><a href="{{ .ActionUrl }}" class="button">Reset My Password</a></p>
  
  <p>This link is valid for a single use and expires in 24 hours.</p>
  
  <p>Please ignore this email if you did not initiate this change. If you need additional assistance, please contact <a href="mailto:help@planninghub.io">help@planninghub.io</a>.</p>
  
  <div class="footer">
    <p>&copy; 2024 Planning Hub. All rights reserved.</p>
  </div>
</body>
</html>
            `
          }
        }),
      }
    );

    const data = await res.json();

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
