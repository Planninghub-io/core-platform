
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processRequest } from './eventProcessors.ts';
import { handleOptionsRequest } from './responseUtils.ts';

// Main handler function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    const { prompt, additionalInfo, modelProvider } = await req.json();
    console.log(`Processing request with prompt: ${prompt}`);
    console.log(`Using model provider: ${modelProvider || 'openai'}`);
    
    const response = await processRequest(prompt, additionalInfo, modelProvider);
    
    // Log the response before sending
    console.log(`Response generated successfully: ${response.status}`);
    
    return response;
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
});
