
import { ChatMessage } from "../../types";
import { addAIMessage } from "../utils/chatMessageUtils";
import { useNavigate } from "react-router-dom";

export const processSuccessfulResponse = (
  response: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
) => {
  // Process the event response - ensure we're getting the data regardless of model
  if (response && (response.data || response.validatedEvent)) {
    const eventData = response.data || response.validatedEvent;
    console.log("Setting generated event data:", eventData);
    
    // Store generated event - make sure this happens
    if (eventData) {
      // Ensure we have all required fields for a valid event
      const validEvent = {
        ...eventData,
        title: eventData.title || "",
        description: eventData.description || "",
        date: eventData.date || "",
        location: eventData.location || "",
        category: eventData.category || "Other",
        estimatedPrice: eventData.estimatedPrice || "0"
      };
      
      console.log("Setting validated event data:", validEvent);
      setGeneratedEvent(validEvent);
      
      // Always increment prompt count to ensure UI updates
      setPromptCount(prev => prev + 1);

      // Add success message
      addAIMessage(
        setChatMessages,
        `Perfect! I've collected all the necessary information. Let's create your event now.`
      );

      // Navigate to create event page with event data
      window.location.href = `/create-event?data=${encodeURIComponent(JSON.stringify(validEvent))}`;

      return {
        validatedEvent: validEvent,
        missing: response.missing || []
      };
    }
  }

  console.error("Missing data property in API response:", response);
  return null;
};
