
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

/**
 * Creates an error message for display
 */
export const createErrorMessage = () => {
  return "I'm sorry, I encountered an error while generating your event. Please try again with a more detailed prompt.";
};

/**
 * Creates a success message for event generation
 */
export const createAIMessage = (event: any) => {
  return `I've created an event plan for you!\n\n**${event.title || 'Your Event'}**\n\n${event.description || ''}\n\nDate: ${event.date || 'To be determined'}\nLocation: ${event.location || 'To be determined'}\nEstimated Budget: ${event.estimatedPrice || 'To be determined'}\nCategory: ${event.category || 'Event'}\n\nPlease review the details and let me know if you'd like to make any changes.`;
};

/**
 * Creates a success message with event title
 */
export const createSuccessMessage = (title: string) => {
  return `Great! I've created your "${title}" event. You can review the details and make any necessary adjustments.`;
};

/**
 * Format message for missing fields
 */
export const formatMissingFieldsMessage = (missingFields: string[]) => {
  let message = "I need more information to generate this event. Could you please provide:";
  
  if (missingFields.includes('date')) {
    message += "\n• The date and time of the event";
  }
  if (missingFields.includes('location')) {
    message += "\n• The location for the event";
  }
  if (missingFields.includes('attendees')) {
    message += "\n• The expected number of attendees";
  }
  if (missingFields.includes('budget')) {
    message += "\n• Your budget for the event";
  }
  
  return message;
};
