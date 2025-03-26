
import { generateEventAPI } from "../../api/generateEventAPI";

/**
 * Generate an event using the API
 */
export const generateEventWithAPI = async (
  userPrompt: string,
  modelProvider: 'openai' | 'anthropic',
  combinedInfo: Record<string, string>
) => {
  console.log(`Generating event with model: ${modelProvider}`);
  console.log("Combined info for API call:", combinedInfo);
  
  // Add model provider to combinedInfo
  const apiPayload = {
    ...combinedInfo,
    modelProvider
  };
  
  // Generate the event
  return await generateEventAPI({
    prompt: userPrompt,
    additionalInfo: apiPayload,
    modelProvider
  });
};
