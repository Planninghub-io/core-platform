
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
  console.log("Processing successful response:", response);
  
  // Process the event response - ensure we're getting the data regardless of model
  if (response && (response.data || response.validatedEvent)) {
    const eventData = response.data || response.validatedEvent;
    console.log("Setting generated event data:", eventData);
    
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
    
    // Make sure to set the generated event before redirecting
    setGeneratedEvent(validEvent);
    
    // Always increment prompt count to ensure UI updates
    setPromptCount(prev => prev + 1);

    // Add success message
    addAIMessage(
      setChatMessages,
      `Perfect! I've created your ${validEvent.category.toLowerCase()} event on ${validEvent.date ? new Date(validEvent.date).toLocaleDateString() : 'the selected date'} in ${validEvent.location}.`
    );

    // Encode the event data and redirect
    const eventDataParam = encodeURIComponent(JSON.stringify(validEvent));
    console.log("Redirecting to create-event with data:", eventDataParam);
    
    // Use a timeout to ensure the state updates have time to propagate
    setTimeout(() => {
      window.location.href = `/create-event?data=${eventDataParam}`;
    }, 500);

    return {
      validatedEvent: validEvent,
      missing: response.missing || []
    };
  }

  console.error("Missing data property in API response:", response);
  return null;
};
