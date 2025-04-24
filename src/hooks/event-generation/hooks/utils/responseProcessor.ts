
import { ChatMessage } from "../../types";
import { GenerateEventResponse, SubmissionResult, GeneratedEvent } from "../../types/api-types";
import { formatMissingFieldsMessage, createSuccessMessage } from "../../utils/chatMessageUtils";

/**
 * Process API response, extracting missing fields and generating user-friendly messages
 */
export const processResponse = (
  response: GenerateEventResponse,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean,
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
  
  // Store generated event data - this ensures we always set it regardless of missing fields
  console.log(`processResponse [${apiCallId}]: Setting generated event state:`, eventData);
  setGeneratedEvent(eventData);
  
  // Add AI message to chat with event creation success
  const successMessage = createSuccessMessage(eventData.title || "Your Event");
  setChatMessages(prev => [...prev, {
    type: 'ai',
    content: successMessage,
    id: `success-${apiCallId}`
  }]);
  
  // If we have missing fields, add another message asking for them
  if (missing && missing.length > 0) {
    console.log(`processResponse [${apiCallId}]: Missing fields detected, will request from user:`, missing);
    
    // Generate AI message asking for the missing information
    const missingFieldMessage = formatMissingFieldsMessage(missing);
    console.log(`processResponse [${apiCallId}]: Sending missing field message to chat:`, missingFieldMessage);
    
    // Add the message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: missingFieldMessage,
      id: `missing-fields-${apiCallId}`
    }]);
  } else {
    // If we have all fields, add a message prompting the user to review
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: "Please review the event details in the form and make any necessary adjustments before creating the event.",
      id: `review-prompt-${apiCallId}`
    }]);
    
    // Encode the event data for redirect
    const eventDataParam = encodeURIComponent(JSON.stringify(eventData));
    console.log(`processResponse [${apiCallId}]: Preparing redirection to create-event with data:`, eventDataParam);
    
    // Use a timeout to ensure the state updates have time to propagate
    setTimeout(() => {
      window.location.href = `/create-event?data=${eventDataParam}`;
    }, 1000);
  }
  
  // Update prompt count for non-resubmissions
  if (!isResubmitting) {
    setPromptCount(prev => prev + 1);
  }
  
  // Always return the event data, even with missing fields
  return {
    validatedEvent: eventData,
    missing: missing,
    error: null
  };
};
