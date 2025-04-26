
import { ChatMessage } from "../../types";
import { GenerateEventResponse, SubmissionResult, GeneratedEvent } from "../../types/api-types";
import { formatMissingFieldsMessage, createSuccessMessage } from "../../utils/chatMessageUtils";

export const processResponse = (
  response: GenerateEventResponse,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean,
  apiCallId: string = 'default'
): SubmissionResult | false => {
  console.log(`processResponse [${apiCallId}]: Processing response:`, JSON.stringify(response, null, 2));
  
  if (!response) {
    console.error(`processResponse [${apiCallId}]: Received null/undefined response`);
    return false;
  }

  if (!response.data) {
    console.error(`processResponse [${apiCallId}]: Response missing data property:`, response);
    return false;
  }

  const eventData = response.data as GeneratedEvent;
  console.log(`processResponse [${apiCallId}]: Extracted event data:`, eventData);
  
  const missing = response.missing || [];
  console.log(`processResponse [${apiCallId}]: Missing fields:`, missing);
  
  console.log(`processResponse [${apiCallId}]: Setting generated event state:`, eventData);
  setGeneratedEvent(eventData);
  
  const eventType = eventData.category?.toLowerCase() || 'event';
  const location = eventData.location || 'your selected location';
  
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

  const successMessage = `Perfect! I've created your ${eventType} in ${location} on ${dateStr}. Taking you to the event form now to complete your event creation.`;
  
  setChatMessages(prev => [...prev, {
    type: 'ai',
    content: successMessage,
    id: `success-${apiCallId}`
  }]);

  // Update prompt count for non-resubmissions
  if (!isResubmitting) {
    setPromptCount(prev => prev + 1);
  }
  
  // Return the event data so it can be used by the parent component
  return {
    validatedEvent: eventData,
    missing: missing,
    error: null
  };
};
