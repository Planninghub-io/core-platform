
import { extractDateFromPrompt } from "./prompt-extraction/dateExtractor";
import { extractLocationFromPrompt } from "./prompt-extraction/locationExtractor";
import { ChatMessage } from "../types";

/**
 * Check if prompt has required information before sending to AI
 * @param prompt The user's prompt to check
 * @param setChatMessages Function to update chat messages
 * @returns Object with missing fields and the prompt to use
 */
export const checkPromptForRequiredFields = (
  prompt: string,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
): { 
  promptToUse: string; 
  missingFields: string[]; 
  shouldProceed: boolean;
  extractedInfo: { date?: string; location?: string } 
} => {
  const missingFields: string[] = [];
  let shouldProceed = true;
  const extractedInfo: { date?: string; location?: string } = {};
  
  // Check for date in the prompt
  const extractedDate = extractDateFromPrompt(prompt);
  if (!extractedDate) {
    missingFields.push("date");
  } else {
    extractedInfo.date = extractedDate;
  }
  
  // Check for location in the prompt
  const extractedLocation = extractLocationFromPrompt(prompt);
  if (!extractedLocation) {
    missingFields.push("location");
  } else {
    extractedInfo.location = extractedLocation;
  }
  
  // If missing fields, add a message asking for them
  if (missingFields.length > 0) {
    let missingFieldsMessage = "I'd like to help plan your event. ";
    
    if (missingFields.includes("date") && missingFields.includes("location")) {
      missingFieldsMessage += "Could you please provide both a date/time and location for your event?";
    } else if (missingFields.includes("date")) {
      missingFieldsMessage += "Could you please provide a date and time for your event?";
    } else if (missingFields.includes("location")) {
      missingFieldsMessage += "Could you please provide a location for your event?";
    }
    
    // Add the message to chat
    setChatMessages(prev => [...prev, { type: 'ai', content: missingFieldsMessage }]);
    shouldProceed = false;
  }
  
  return { promptToUse: prompt, missingFields, shouldProceed, extractedInfo };
};
