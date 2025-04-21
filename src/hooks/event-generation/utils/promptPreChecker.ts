
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
  extractedInfo: { date?: string; location?: string; description?: string; eventType?: string } 
} => {
  const missingFields: string[] = [];
  let shouldProceed = true;
  const extractedInfo: { 
    date?: string; 
    location?: string; 
    description?: string;
    eventType?: string
  } = {};
  
  // Check if we have any event description
  if (!prompt || prompt.trim().length < 10) {
    missingFields.push("description");
  } else {
    extractedInfo.description = prompt;
  }
  
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
  
  // Check for event type in the prompt
  const eventTypeRegex = /(birthday|wedding|party|meeting|conference|dinner|lunch|brunch|gathering|ceremony|celebration|corporate|team building|reception)/i;
  const eventTypeMatch = prompt.match(eventTypeRegex);
  if (!eventTypeMatch) {
    missingFields.push("eventType");
  } else {
    extractedInfo.eventType = eventTypeMatch[0];
  }
  
  // If missing fields, add a message asking for them
  if (missingFields.length > 0) {
    let missingFieldsMessage = "I'd like to help plan your event. ";
    
    if (missingFields.includes("description")) {
      missingFieldsMessage = "Please provide more details about the event you'd like to create.";
    } else {
      const missingDetailsText = [];
      
      if (missingFields.includes("date")) {
        missingDetailsText.push("date and time");
      }
      if (missingFields.includes("location")) {
        missingDetailsText.push("location");
      }
      if (missingFields.includes("eventType")) {
        missingDetailsText.push("event type (birthday, wedding, corporate event, etc.)");
      }
      
      missingFieldsMessage += `Could you please provide the following details: ${missingDetailsText.join(", ")}?`;
    }
    
    // Add the message to chat
    setChatMessages(prev => [...prev, { type: 'ai', content: missingFieldsMessage }]);
    shouldProceed = false;
  }
  
  return { promptToUse: prompt, missingFields, shouldProceed, extractedInfo };
};

/**
 * Track pending information and check if all required fields are now present
 * @param originalPrompt The original user prompt
 * @param pendingInfo Current pending information
 * @param newPrompt New user input
 * @returns Updated pending info and whether we should proceed
 */
export const trackPendingInformation = (
  originalPrompt: string | undefined,
  pendingInfo: { date?: string; location?: string; description?: string; eventType?: string },
  newPrompt: string
): { 
  updatedInfo: { date?: string; location?: string; description?: string; eventType?: string };
  shouldProceed: boolean;
  completePrompt: string;
} => {
  // Extract new information from the prompt
  const extractedDate = extractDateFromPrompt(newPrompt);
  const extractedLocation = extractLocationFromPrompt(newPrompt);
  
  // Check for event type in the prompt
  const eventTypeRegex = /(birthday|wedding|party|meeting|conference|dinner|lunch|brunch|gathering|ceremony|celebration|corporate|team building|reception)/i;
  const eventTypeMatch = newPrompt.match(eventTypeRegex);
  const extractedEventType = eventTypeMatch ? eventTypeMatch[0] : null;
  
  // Update pending info with any new extracted information
  const updatedInfo = { 
    ...pendingInfo,
    date: extractedDate || pendingInfo.date,
    location: extractedLocation || pendingInfo.location,
    eventType: extractedEventType || pendingInfo.eventType,
  };
  
  // Check if we now have all required information
  const hasAllRequiredInfo = Boolean(
    updatedInfo.date && 
    updatedInfo.location && 
    updatedInfo.eventType && 
    (updatedInfo.description || originalPrompt)
  );
                           
  // Construct a complete prompt that includes all the gathered information
  let completePrompt = originalPrompt || "";
  
  // If we're gathering additional info, append it to the original prompt
  if (originalPrompt) {
    let additionalInfo = "";
    
    if (updatedInfo.date && !originalPrompt.includes(updatedInfo.date)) {
      additionalInfo += ` on ${updatedInfo.date}`;
    }
    
    if (updatedInfo.location && !originalPrompt.includes(updatedInfo.location)) {
      additionalInfo += ` at ${updatedInfo.location}`;
    }
    
    if (updatedInfo.eventType && !originalPrompt.toLowerCase().includes(updatedInfo.eventType.toLowerCase())) {
      additionalInfo += ` It's a ${updatedInfo.eventType} event.`;
    }
    
    if (additionalInfo) {
      completePrompt += additionalInfo;
    }
  }
  
  return { 
    updatedInfo, 
    shouldProceed: hasAllRequiredInfo,
    completePrompt: completePrompt || newPrompt
  };
};
