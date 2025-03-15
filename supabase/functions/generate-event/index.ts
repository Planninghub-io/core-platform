
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processRequest } from './eventProcessors.ts';
import { handleOptionsRequest } from './responseUtils.ts';

// Main handler function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    const { prompt, additionalInfo } = await req.json();
    return await processRequest(prompt, additionalInfo);
  } catch (error) {
    console.error('Error parsing request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to parse request' }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
