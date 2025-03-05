
// Utilities for creating standardized response objects

import { EventResponse, ErrorResponse } from './types.ts';

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Create success response with event data
 */
export function createSuccessResponse(data: EventResponse): Response {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Create error response
 */
export function createErrorResponse(error: Error): Response {
  return new Response(
    JSON.stringify({ error: error.message }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Handle OPTIONS request for CORS
 */
export function handleOptionsRequest(): Response {
  return new Response(null, { headers: corsHeaders });
}
