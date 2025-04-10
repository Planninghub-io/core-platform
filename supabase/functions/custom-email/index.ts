
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

    console.log("Updating email templates with URL:", supabaseUrl);

    // This endpoint allows you to customize the email templates used for password resets
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/email-templates`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': `${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          // Set global settings for all templates
          "action_link": {
            "email_subject": "Reset your password",
            "email_from_name": "Planning Hub Team"
          },
          // Customize the recovery (password reset) template
          "recovery": {
            "email_subject": "Reset your password",
            "email_from_name": "Planning Hub Team",
            "email_from_email": "noreply@planninghub.io",
            "template_html": `
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
      color: #ffffff;
      background-color: #000000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      text-align: center;
      padding: 40px 20px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border: 1px solid #ffffff;
      border-radius: 4px;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 30px;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background-color: #ffffff;
      color: #000000;
      padding: 16px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0 30px 0;
    }
    .note {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">P</div>
    
    <h1>Reset your password</h1>
    
    <p>Follow the button to reset the password for your user.</p>
    
    <a href="{{ .ActionUrl }}" target="_blank" class="button">Reset Password</a>
    
    <p class="note">If you did not request password reset, you can safely ignore this email, nothing further will happen.</p>
  </div>
</body>
</html>
            `
          }
        }),
      }
    );

    const data = await res.json();
    console.log("Email template update response:", data);

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
    console.error("Error updating email templates:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
