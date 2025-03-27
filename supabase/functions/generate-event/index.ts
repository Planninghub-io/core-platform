
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processRequest } from './eventProcessors.ts';
import { handleOptionsRequest } from './responseUtils.ts';

// Cache storage for frequent requests
const responseCache = new Map();

// Main handler function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    // Get request body
    const body = await req.json();
    const { prompt, additionalInfo, modelProvider } = body;
    
    // Generate a cache key based on the request
    const cacheKey = `${prompt}-${JSON.stringify(additionalInfo || {})}-${modelProvider || 'openai'}`;
    
    // Check if we have a cached response (valid for 5 minutes)
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < 300000) {
      console.log(`Returning cached response for prompt: ${prompt}`);
      return new Response(JSON.stringify(cachedResponse.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      });
    }
    
    console.log(`Processing request with prompt: ${prompt}`);
    console.log(`Using model provider: ${modelProvider || 'openai'}`);
    
    const response = await processRequest(prompt, additionalInfo, modelProvider);
    
    // Cache the successful response
    if (response.status === 200) {
      try {
        const responseData = await response.json();
        responseCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        });
        
        // Return a new response with the same data
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'max-age=300' // Cache for 5 minutes
          }
        });
      } catch (e) {
        console.log('Error parsing response JSON for caching:', e);
        // If we can't parse the response for caching, just return it
        return response;
      }
    }
    
    // Log the response status before sending
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
