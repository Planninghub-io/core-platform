
import { supabase } from "@/integrations/supabase/client";
import { GeneratedEvent } from "../types";

// Small client-side cache to prevent duplicate requests
const apiCache = new Map();

interface GenerateEventParams {
  prompt: string;
  additionalInfo?: Record<string, string>;
}

interface GenerateEventResponse {
  validatedEvent?: GeneratedEvent;
  missing?: string[];
  needsMoreInfo?: boolean;
  data?: any;
  error?: Error;
}

export const generateEventAPI = async ({
  prompt,
  additionalInfo = {}
}: GenerateEventParams): Promise<GenerateEventResponse> => {
  try {
    // Create a cache key from the request parameters
    const cacheKey = `${prompt}-${JSON.stringify(additionalInfo)}`;
    
    // Check cache for recent identical requests (valid for 1 minute)
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < 60000) {
      console.log("generateEventAPI: Returning cached response for:", prompt);
      return cachedResponse.data;
    }
    
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.log("generateEventAPI: Called with prompt:", prompt);
      console.log("generateEventAPI: Additional info:", additionalInfo);
    }
    
    let fullPrompt = prompt;
    if (Object.keys(additionalInfo).length > 0) {
      const additionalDetails = Object.entries(additionalInfo)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      
      if (additionalDetails) {
        fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
      }
    }

    console.log('generateEventAPI: Sending prompt to generate event:', fullPrompt);

    const { data, error } = await supabase.functions.invoke('generate-event', {
      body: { 
        prompt: fullPrompt,
        additionalInfo
      },
    });

    if (error) {
      console.error('generateEventAPI: Edge function error:', error);
      throw error;
    }

    console.log('generateEventAPI: Received response from generate-event:', data);
    
    // Process the data to check if we're missing required fields
    const missingFields = data.missingFields || [];
    
    // Prepare the response
    const response = { 
      data,
      missing: missingFields,
      needsMoreInfo: missingFields.length > 0
    };
    
    // Cache the successful response
    apiCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    
    return response;
  } catch (error: any) {
    console.error('generateEventAPI: Error generating event:', error);
    return { error };
  }
};
