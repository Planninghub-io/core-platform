
import { supabase } from "@/integrations/supabase/client";
import { GeneratedEvent } from "../types";

interface GenerateEventParams {
  prompt: string;
  additionalInfo?: Record<string, string>;
  modelProvider?: 'openai' | 'anthropic';
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
  additionalInfo = {},
  modelProvider = 'openai'
}: GenerateEventParams): Promise<GenerateEventResponse> => {
  try {
    // Log the provided info to help with debugging
    console.log("Combined info before API call:", additionalInfo);
    console.log("Using model provider:", modelProvider);
    
    let fullPrompt = prompt;
    if (Object.keys(additionalInfo).length > 0) {
      // Filter out modelProvider from the prompt details
      const { modelProvider: _, ...promptDetails } = additionalInfo;
      
      const additionalDetails = Object.entries(promptDetails)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      
      if (additionalDetails) {
        fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
      }
    }

    console.log('Sending prompt to generate event:', fullPrompt);

    const { data, error } = await supabase.functions.invoke('generate-event', {
      body: { 
        prompt: fullPrompt,
        modelProvider,
        additionalInfo
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    console.log('Received response from generate-event:', data);
    
    // Process the data to check if we're missing required fields
    const missingFields = [];
    
    // Check for required fields
    if (!data.date) missingFields.push('date');
    if (!data.location) missingFields.push('location');
    if (!data.estimatedPrice) missingFields.push('budget');
    if (!additionalInfo.attendees) missingFields.push('attendees');
    
    // If we're missing fields, format the response appropriately
    if (missingFields.length > 0) {
      console.log('Missing fields detected:', missingFields);
      return { 
        data,
        missing: missingFields,
        needsMoreInfo: true
      };
    }
    
    return { data };
  } catch (error: any) {
    console.error('Error generating event:', error);
    return { error };
  }
};
