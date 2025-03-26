
import { extractBudgetFromPrompt } from "../../utils/prompt-extraction";

/**
 * Handle budget extraction from user prompt
 */
export const processBudgetResponse = (
  userPrompt: string,
  waitingForBudget: boolean,
  setAdditionalInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>
): boolean => {
  if (waitingForBudget) {
    console.log("Processing budget response");
    // Add the extracted budget to additionalInfo
    const extractedBudget = extractBudgetFromPrompt(userPrompt) || userPrompt;
    setAdditionalInfo(prev => ({
      ...prev,
      budget: extractedBudget
    }));
    
    // Return true to indicate we handled the budget prompt
    return true;
  }
  
  return false;
};
