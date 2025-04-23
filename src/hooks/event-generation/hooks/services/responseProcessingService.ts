
import { ChatMessage } from "../../types";
import { addAIMessage } from "../utils/chatMessageUtils";

/**
 * Process successful event generation response
 */
export const processSuccessfulResponse = (
  response: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
) => {
  // Add AI response to chat messages
  addAIMessage(
    setChatMessages,
    `I've generated an event plan based on your request. Please review the details below.`
  );
  
  console.log("Processing successful API response:", response);
  
  // Process the event response - ensure we're getting the data regardless of model
  if (response && (response.data || response.validatedEvent)) {
    const eventData = response.data || response.validatedEvent;
    console.log("Setting generated event data:", eventData);
    
    // Store generated event - make sure this happens
    if (eventData) {
      // Ensure we have all required fields for a valid event
      const validEvent = {
        ...eventData,
        title: eventData.title || "New Event",
        description: eventData.description || "",
        date: eventData.date || "",
        location: eventData.location || "",
        category: eventData.category || "Other",
        estimatedPrice: eventData.estimatedPrice || "Free"
      };
      
      console.log("Setting validated event data:", validEvent);
      setGeneratedEvent(validEvent);
      
      // Force prompt count increment to trigger UI updates
      setPromptCount(prev => {
        console.log(`Incrementing prompt count from ${prev} to ${prev + 1}`);
        return prev + 1;
      });
    } else {
      console.error("No eventData found in API response");
    }

    // Return the processed data to maintain consistency
    return {
      validatedEvent: eventData,
      missing: response.missing || []
    };
  } else {
    console.error("Missing data property in API response:", response);
    return null;
  }
};
