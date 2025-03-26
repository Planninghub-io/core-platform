
import { 
  extractDateFromPrompt,
  extractLocationFromPrompt,
  extractBudgetFromPrompt
} from "../../utils/prompt-extraction";

/**
 * Extract information from a prompt and combine with additional info
 */
export const processPrompt = (
  userPrompt: string,
  additionalInfo: Record<string, string> = {}
): Record<string, string> => {
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
