
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
  
  console.log("API response:", response);
  
  // Process the event response
  if (response.data) {
    // Store generated event
    setGeneratedEvent(response.data);
    
    // Update prompt count for new prompts
    if (!isResubmitting) {
      setPromptCount(prev => prev + 1);
    }
  }
};
