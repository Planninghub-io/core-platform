
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
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>,
  apiCallId: string = 'default'
): SubmissionResult | false => {
  console.log(`processResponse [${apiCallId}]: Processing response:`, JSON.stringify(response, null, 2));
  
  // Guard against null/undefined response
  if (!response) {
    console.error(`processResponse [${apiCallId}]: Received null/undefined response`);
    return false;
  }

  // Guard against missing data property
  if (!response.data) {
    console.error(`processResponse [${apiCallId}]: Response missing data property:`, response);
    return false;
  }

  // Extract event data
  const eventData = response.data as GeneratedEvent;
  console.log(`processResponse [${apiCallId}]: Extracted event data:`, eventData);
  
  // Extract all missing fields based on response
  const missing = response.missing || [];
  console.log(`processResponse [${apiCallId}]: Missing fields:`, missing);
  
  // Check if we're missing budget specifically
  if (missing.includes('budget') && !waitingForBudget) {
    console.log(`processResponse [${apiCallId}]: Budget information needed, requesting in chat`);
    requestBudgetInChat();
    return { 
      needsBudget: true, 
      validatedEvent: eventData, 
      missing 
    };
  }
  
  // If we have missing fields, ask the user for them
  if (missing.length > 0) {
    console.log(`processResponse [${apiCallId}]: Missing fields detected, will request from user:`, missing);
    // Update previously requested fields to track what we're asking for
    setPreviouslyRequestedFields(missing);
    
    // Generate AI message asking for the missing information
    const missingFieldMessage = formatMissingFieldsMessage(missing);
    console.log(`processResponse [${apiCallId}]: Sending missing field message to chat:`, missingFieldMessage);
    
    // Add the message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: missingFieldMessage,
      id: `missing-fields-${apiCallId}`
    }]);
    
    // Always return the event data, even with missing fields,
    // so it can be displayed with a form to collect missing info
    return { 
      validatedEvent: eventData, 
      missing, 
      error: null 
    };
  }
  
  // If we have a complete event with no missing fields
  if (eventData) {
    console.log(`processResponse [${apiCallId}]: Event is complete, sending success message`);
    // Success message
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: createSuccessMessage(eventData.title || "Your Event"),
      id: `success-${apiCallId}`
    }]);
    
    return { 
      validatedEvent: eventData, 
      missing: [], 
      error: null 
    };
  }
  
  console.log(`processResponse [${apiCallId}]: No conditions met, returning false`);
  return false;
};
