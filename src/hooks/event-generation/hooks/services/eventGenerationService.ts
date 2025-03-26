
import { supabase } from "@/integrations/supabase/client";

/**
 * Calls the API to generate an event based on a prompt
 */
export const generateEventAPI = async ({
  prompt,
  additionalInfo = {},
  modelProvider = 'openai'
}: {
  prompt: string;
  additionalInfo?: Record<string, string>;
  modelProvider?: 'openai' | 'anthropic';
}) => {
  try {
    // Validate prompt
    if (!prompt || !prompt.trim()) {
      return { error: new Error("Please enter an event description") };
    }
    
    console.log('Sending prompt to generate event:', prompt);
    console.log('Using model provider:', modelProvider);
    
    // Call the actual API
    const { data, error } = await supabase.functions.invoke('generate-event', {
      body: { 
        prompt,
        modelProvider,
        additionalInfo
      },
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Received response from generate-event:', data);
    return { data };
  } catch (error: any) {
    console.error('Error generating event:', error);
    return { error };
  }
};
