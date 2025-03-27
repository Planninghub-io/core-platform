
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
  
  console.log(`generateEventWithAPI [${apiCallId}]: Generating event with model: ${modelProvider}`);
  console.log(`generateEventWithAPI [${apiCallId}]: Combined info for API call:`, combinedInfo);
  
  // Generate the event
  const response = await generateEventAPI({
    prompt: userPrompt,
    additionalInfo: combinedInfo,
    modelProvider
  });
  
  console.log(`generateEventWithAPI [${apiCallId}]: API response:`, response);
  
  return response;
};
