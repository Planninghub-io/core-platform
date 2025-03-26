
import { 
  extractDateFromPrompt,
  extractLocationFromPrompt,
  extractBudgetFromPrompt
} from "../../utils/prompt-extraction";
import { ChatMessage } from "../../types";

/**
 * Extract information from a prompt and combine with additional info
 */
export const processPrompt = (
  userPrompt: string,
  additionalInfo: Record<string, string> = {}
): Record<string, string> => {
  // Handle empty prompts
  if (!userPrompt || !userPrompt.trim()) {
    return { ...additionalInfo };
  }
  
  // Extract information from the prompt
  const extractedDate = extractDateFromPrompt(userPrompt);
  const extractedLocation = extractLocationFromPrompt(userPrompt);
  const extractedBudget = extractBudgetFromPrompt(userPrompt);
  
  // Prepare additional info
  const combinedInfo: Record<string, string> = { ...additionalInfo };
  
  if (extractedDate) {
    combinedInfo.date = extractedDate;
  }
  
  if (extractedLocation) {
    combinedInfo.location = extractedLocation;
  }
  
  if (extractedBudget) {
    combinedInfo.budget = extractedBudget;
  }
  
  return combinedInfo;
};

/**
 * Extract the prompt directly from chat messages
 */
export const getPromptFromChatMessages = (chatMessages: ChatMessage[]): string => {
  if (!chatMessages || chatMessages.length === 0) {
    return "";
  }
  
  // Find the most recent user message
  for (let i = chatMessages.length - 1; i >= 0; i--) {
    if (chatMessages[i].type === 'user') {
      return chatMessages[i].content;
    }
  }
  
  return "";
};

/**
 * Find the most recent user message in chat history
 */
export const findMostRecentUserMessage = (chatMessages: ChatMessage[]): string => {
  if (!chatMessages || chatMessages.length === 0) {
    return "";
  }
  
  // Iterate from the most recent message backwards
  for (let i = chatMessages.length - 1; i >= 0; i--) {
    if (chatMessages[i].type === 'user') {
      return chatMessages[i].content;
    }
  }
  
  return "";
};
