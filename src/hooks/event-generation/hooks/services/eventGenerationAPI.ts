
import { generateEventAPI } from "../../api/generateEventAPI";

/**
 * Generate an event using the API, but only when explicitly called
 */
export const generateEventWithAPI = async (
  userPrompt: string,
  modelProvider: 'openai' | 'anthropic',
  combinedInfo: Record<string, string>,
  apiCallId: string = 'default'
) => {
  // Skip automatic/empty calls that might happen on page load
  if (!userPrompt || userPrompt.trim() === '') {
    console.log(`generateEventWithAPI [${apiCallId}]: Skipping empty prompt call`);
    return { skipped: true };
  }
  
  try {
    console.log(`generateEventWithAPI [${apiCallId}]: Generating event with model: ${modelProvider}`);
    console.log(`generateEventWithAPI [${apiCallId}]: Combined info for API call:`, combinedInfo);
    
    // Check if the prompt contains a date reference like "April 5th"
    const dateRegex = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?/i;
    const dateMatch = userPrompt.match(dateRegex);
    
    // If the prompt is just a date answer with no other context
    if (dateMatch && userPrompt.split(' ').length <= 3) {
      console.log(`generateEventWithAPI [${apiCallId}]: Detected date-only response: ${userPrompt}`);
      const currentYear = new Date().getFullYear();
      const dateText = `${dateMatch[0]}, ${currentYear}`;
      
      // Add the date to combinedInfo
      const updatedInfo = { 
        ...combinedInfo,
        date: dateText 
      };
      
      // Check if we have a stored original prompt to use
      if ('originalPrompt' in updatedInfo && updatedInfo.originalPrompt) {
        // Use the original prompt with the new date info
        console.log(`generateEventWithAPI [${apiCallId}]: Using stored original prompt with date info`);
        const fullPrompt = updatedInfo.originalPrompt;
        
        // Generate the event with the original prompt and date info
        const response = await generateEventAPI({
          prompt: fullPrompt,
          additionalInfo: updatedInfo,
          modelProvider
        });
        
        console.log(`generateEventWithAPI [${apiCallId}]: API response for original prompt with date:`, response);
        return response;
      }
    }
    
    // Standard flow - generate the event with the current prompt
    const response = await generateEventAPI({
      prompt: userPrompt,
      additionalInfo: combinedInfo,
      modelProvider
    });
    
    console.log(`generateEventWithAPI [${apiCallId}]: API response:`, response);
    return response;
  } catch (error) {
    console.error(`generateEventWithAPI [${apiCallId}]: Error generating event:`, error);
    return { error };
  }
};
