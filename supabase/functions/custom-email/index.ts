
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers for browser access
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

// Production URL constant - ensure it's pointing to your app's actual URL
const PRODUCTION_URL = 'https://yourplanner.ai';

// Handle CORS preflight requests
function handleCorsPreflightRequest(): Response {
  return new Response('ok', { headers: corsHeaders });
}

// Validate environment variables
function validateEnvironmentVariables(): { isValid: boolean; error?: string } {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      isValid: false,
      error: 'Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    };
  }
  
  return { isValid: true };
}

// Parse request body safely
async function parseRequestBody(req: Request): Promise<Record<string, any>> {
  try {
    if (req.body) {
      const body = await req.json();
      console.log("Request body:", body);
      return body;
    }
  } catch (e) {
    console.error("Failed to parse request body:", e);
  }
  
  return {};
}

// Get HTML template for password reset email
function getPasswordResetEmailTemplate(): string {
  return `
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
      color: #6c5ce7;
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
      background-color: #6c5ce7;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      margin: 20px 0 30px 0;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #5649c0;
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
    <div class="logo">Planning Hub</div>
    
    <h1>Reset your password</h1>
    
    <p>We received a request to reset your password. Click the button below to create a new password.</p>
    
    <a href="{{ .ConfirmationURL }}" target="_blank" class="button">Reset Password</a>
    
    <p class="note">If you didn't request a password reset, you can safely ignore this email - nothing will be changed.</p>
    
    <div class="footer">
      &copy; 2025 Planning Hub. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}

// Create email template settings object
function createEmailTemplateSettings(): Record<string, any> {
  return {
    // Set global settings for all templates
    "action_link": {
      "email_subject": "Reset your Planning Hub password",
      "email_from_name": "Planning Hub Team",
      "email_from_email": "noreply@planninghub.io",
    },
    // Customize the recovery (password reset) template
    "recovery": {
      "email_subject": "Reset your Planning Hub password",
      "email_from_name": "Planning Hub Team",
      "email_from_email": "noreply@planninghub.io",
      "template_html": getPasswordResetEmailTemplate(),
    }
  };
}

// Try multiple API endpoints to update email templates
async function tryUpdateEmailTemplates(
  supabaseUrl: string, 
  supabaseServiceKey: string, 
  timestamp: number
): Promise<{ response: Response | null; lastError: string | null }> {
  const endpoints = [
    `/auth/v1/admin/templates?cb=${timestamp}`,
    `/rest/v1/auth/templates?cb=${timestamp}`,
    `/auth/admin/templates?cb=${timestamp}`,
  ];
  
  let response = null;
  let lastError = null;
  
  console.log("Trying multiple API endpoints for template update...");
  
  // Try each endpoint until one works
  for (const endpoint of endpoints) {
    const apiUrl = `${supabaseUrl}${endpoint}`;
    console.log(`Trying API URL: ${apiUrl}`);
    
    try {
      // Call the Auth Admin API to update email templates
      const attemptResponse = await fetch(
        apiUrl,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          body: JSON.stringify(createEmailTemplateSettings()),
        }
      );
      
      // If successful, store the response and break the loop
      if (attemptResponse.ok) {
        response = attemptResponse;
        console.log(`Success with endpoint: ${endpoint}`);
        break;
      }
      
      // If not successful, store the error but continue trying other endpoints
      const responseText = await attemptResponse.text();
      console.error(`Failed with endpoint ${endpoint}: HTTP ${attemptResponse.status} - ${responseText}`);
      lastError = `HTTP ${attemptResponse.status} - ${responseText}`;
    } catch (err) {
      console.error(`Error with endpoint ${endpoint}:`, err);
      lastError = err.message || err.toString();
    }
  }

  return { response, lastError };
}

// Process response text and create response object
async function createResponseObject(response: Response): Promise<Record<string, any>> {
  // Get response as text
  const responseText = await response.text();
  console.log(`Response status: ${response.status}, text length: ${responseText.length}`);

  // Try to parse the response as JSON if possible
  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.log("Response is not valid JSON, using text response");
    return { text: responseText };
  }
}

// Main request handler
async function handleRequest(req: Request): Promise<Response> {
  try {
    // Validate environment variables
    const validation = validateEnvironmentVariables();
    if (!validation.isValid) {
      console.error(validation.error);
      throw new Error(validation.error);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log("Setting up email templates at URL:", supabaseUrl);
    
    // Parse request body if provided but always use PRODUCTION_URL
    await parseRequestBody(req);
    
    console.log("Using production URL for templates:", PRODUCTION_URL);

    // Add timestamp to prevent caching
    const timestamp = Date.now();
    
    // Try updating templates using multiple endpoints
    const { response, lastError } = await tryUpdateEmailTemplates(
      supabaseUrl, 
      supabaseServiceKey, 
      timestamp
    );

    // If all attempts failed, throw an error
    if (!response || !response.ok) {
      throw new Error(`All template update attempts failed. Last error: ${lastError}`);
    }

    // Process response and create response object
    const data = await createResponseObject(response);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email templates updated successfully",
        data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating email templates:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred",
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 instead of 500 to prevent cascading failures
      }
    );
  }
}

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  return handleRequest(req);
});
