
import { ChatMessage } from "../../types";
import { addAIMessage } from "../utils/chatMessageUtils";

export const processSuccessfulResponse = (
  response: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
) => {
  console.log("Processing successful response:", response);
  
  if (response && (response.data || response.validatedEvent)) {
    const eventData = response.data || response.validatedEvent;
    console.log("Setting generated event data:", eventData);
    
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
    setPromptCount(prev => prev + 1);

    addAIMessage(
      setChatMessages,
      `Perfect! I've created your ${validEvent.category.toLowerCase()} event on ${validEvent.date ? new Date(validEvent.date).toLocaleDateString() : 'the selected date'} in ${validEvent.location}.`
    );

    return {
      validatedEvent: validEvent,
      missing: response.missing || []
    };
  }

  console.error("Missing data property in API response:", response);
  return null;
};
