
import { ChatMessage } from "../types";

export const findLastUserPrompt = (chatMessages: ChatMessage[]) => {
  // Find the last user message that isn't just answering a specific question
  for (let i = chatMessages.length - 1; i >= 0; i--) {
    if (chatMessages[i].type === 'user') {
      // Skip messages that are just answering budget/date/location questions
      const content = chatMessages[i].content.toLowerCase();
      
      // Simple heuristic: if the message is just a number, date, or location, skip it
      if (!/^\$?\d+$/.test(content) && 
          !content.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)/i) &&
          !content.match(/^(in|at) /i)) {
        return chatMessages[i].content;
      }
    }
  }
  
  // If we couldn't find a good prompt, use the first user message
  const firstUserMessage = chatMessages.find(msg => msg.type === 'user');
  return firstUserMessage ? firstUserMessage.content : '';
};
