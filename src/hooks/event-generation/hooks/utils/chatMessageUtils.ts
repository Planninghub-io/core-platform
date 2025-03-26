
import { ChatMessage } from "../../types";

/**
 * Extracts the most recent user message from chat history
 */
export const findLastUserMessage = (
  messages: ChatMessage[]
): string => {
  if (!messages || messages.length === 0) {
    return "";
  }
  
  // Iterate from the most recent message backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].type === 'user') {
      return messages[i].content;
    }
  }
  
  return "";
};

/**
 * Adds an AI message to the chat
 */
export const addAIMessage = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  content: string
) => {
  setChatMessages(prev => [
    ...prev,
    { type: 'ai', content }
  ]);
};

/**
 * Adds an error message to the chat
 */
export const addErrorMessage = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  error: any
) => {
  console.error('Error in event generation:', error);
  
  setChatMessages(prev => [...prev, {
    type: 'ai',
    content: "I'm sorry, I encountered an error while generating your event. Please try again with a more detailed prompt."
  }]);
};

