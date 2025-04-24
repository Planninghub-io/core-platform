
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
  const eventType = eventData.category?.toLowerCase() || 'event';
  const location = eventData.location || 'your selected location';
  
  // Format date nicely if available
  let dateStr = 'the specified date';
  if (eventData.date) {
    try {
      const date = new Date(eventData.date);
      dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
    }
  }

  const successMessage = `Perfect! I've collected all the necessary information for your ${eventType} in ${location} on ${dateStr}. I'm taking you to the event form to review and complete your event.`;
  
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
  }

  // Encode the event data for redirect
  const eventDataParam = encodeURIComponent(JSON.stringify(eventData));
  console.log(`processResponse [${apiCallId}]: Preparing redirection to create-event with data:`, eventDataParam);
  
  // Redirect to create-event with the data
  setTimeout(() => {
    window.location.href = `/create-event?data=${eventDataParam}`;
  }, 1000);
  
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
