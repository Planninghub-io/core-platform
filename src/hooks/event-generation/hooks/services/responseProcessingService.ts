
import { ChatMessage } from "../../types";
import { addAIMessage } from "../utils/chatMessageUtils";
import { GeneratedEvent, SubmissionResult } from "../../types/api-types";

export const processSuccessfulResponse = (
  response: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
): SubmissionResult | null => {
  console.log("processSuccessfulResponse: Processing response:", response);
  
  if (response && (response.data || response.validatedEvent)) {
    const eventData = response.data || response.validatedEvent;
    console.log("processSuccessfulResponse: Setting generated event data:", eventData);
    
    const validEvent = {
      ...eventData,
      title: eventData.title || "New Event",
      description: eventData.description || "",
      date: eventData.date || new Date().toISOString(),
      location: eventData.location || "",
      category: eventData.category || "Other",
      estimatedPrice: eventData.estimatedPrice || "0"
    };
    
    console.log("processSuccessfulResponse: Setting validated event data:", validEvent);
    
    // Set the generated event state
    setGeneratedEvent(validEvent);
    
    // Update prompt count if not resubmitting
    if (!isResubmitting) {
      setPromptCount(prev => prev + 1);
    }

    // Create success message for chat
    const eventType = validEvent.category?.toLowerCase() || 'event';
    const location = validEvent.location || 'the specified location';
    const dateStr = validEvent.date ? new Date(validEvent.date).toLocaleDateString() : 'the selected date';
    
    // Add initial confirmation message
    addAIMessage(setChatMessages, "Great! I have all the required information to create your event. Let me prepare that for you now.");
    
    // Add the detailed success message after a short delay
    setTimeout(() => {
      addAIMessage(
        setChatMessages,
        `Perfect! I've created your ${eventType} event for ${dateStr} at ${location}. Taking you to the event form now where you can review and customize all the details.`
      );
    }, 1000);

    return {
      validatedEvent: validEvent,
      missing: response.missing || [],
      error: null
    };
  }

  console.error("processSuccessfulResponse: Missing data in response:", response);
  return null;
};
