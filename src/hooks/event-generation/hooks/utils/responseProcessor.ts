
import { ChatMessage } from "../../types";
import { GenerateEventResponse, SubmissionResult, GeneratedEvent } from "../../types/api-types";
import { formatMissingFieldsMessage, createSuccessMessage } from "../../utils/chatMessageUtils";

/**
 * Process API response, extracting missing fields and generating user-friendly messages
 */
export const processResponse = (
  response: GenerateEventResponse,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void,
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>
): SubmissionResult | false => {
  console.log("processResponse: Processing response:", JSON.stringify(response, null, 2));
  
  // Guard against null/undefined response
  if (!response) {
    console.error("processResponse: Received null/undefined response");
    return false;
  }

  // Guard against missing data property
  if (!response.data) {
    console.error("processResponse: Response missing data property:", response);
    return false;
  }

  // Extract event data
  const eventData = response.data as GeneratedEvent;
  console.log("processResponse: Extracted event data:", eventData);
  
  // Extract all missing fields based on response
  const missing = response.missing || [];
  console.log("processResponse: Missing fields:", missing);
  
  // Check if we're missing budget specifically
  if (missing.includes('budget') && !waitingForBudget) {
    console.log("processResponse: Budget information needed, requesting in chat");
    requestBudgetInChat();
    return { 
      needsBudget: true, 
      validatedEvent: eventData, 
      missing 
    };
  }
  
  // If we have missing fields, ask the user for them
  if (missing.length > 0) {
    console.log("processResponse: Missing fields detected, will request from user:", missing);
    // Update previously requested fields to track what we're asking for
    setPreviouslyRequestedFields(missing);
    
    // Generate AI message asking for the missing information
    const missingFieldMessage = formatMissingFieldsMessage(missing);
    console.log("processResponse: Sending missing field message to chat:", missingFieldMessage);
    
    // Add the message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: missingFieldMessage
    }]);
    
    return { 
      validatedEvent: eventData, 
      missing, 
      error: null 
    };
  }
  
  // If we have a complete event with no missing fields
  if (missing.length === 0 && eventData) {
    console.log("processResponse: Event is complete, sending success message");
    // Success message
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: createSuccessMessage(eventData.title || "Your Event")
    }]);
    
    return { 
      validatedEvent: eventData, 
      missing: [], 
      error: null 
    };
  }
  
  console.log("processResponse: No conditions met, returning false");
  return false;
};
