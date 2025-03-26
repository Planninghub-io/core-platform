
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
  if (!response || !response.data) {
    return false;
  }

  // Extract event data
  const eventData = response.data as GeneratedEvent;
  
  // Extract all missing fields based on response
  const missing = response.missing || [];
  console.log("Missing fields:", missing);
  
  // Check if we're missing budget specifically
  if (missing.includes('budget') && !waitingForBudget) {
    requestBudgetInChat();
    return { needsBudget: true, validatedEvent: eventData, missing };
  }
  
  // If we have missing fields, ask the user for them
  if (missing.length > 0) {
    // Update previously requested fields to track what we're asking for
    setPreviouslyRequestedFields(missing);
    
    // Generate AI message asking for the missing information
    const missingFieldMessage = formatMissingFieldsMessage(missing);
    
    // Add the message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: missingFieldMessage
    }]);
    
    return { validatedEvent: eventData, missing, error: null };
  }
  
  // If we have a complete event with no missing fields
  if (missing.length === 0 && eventData) {
    // Success message
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: createSuccessMessage(eventData.title || "Your Event")
    }]);
    
    return { validatedEvent: eventData, missing: [], error: null };
  }
  
  return false;
};
