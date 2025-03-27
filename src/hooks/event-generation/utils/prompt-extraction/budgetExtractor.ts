
/**
 * Utility functions for extracting budget information from user prompts
 */

/**
 * Extract budget from a user prompt
 * @param promptText The user prompt to analyze
 * @returns The extracted budget string or null if not found
 */
export const extractBudgetFromPrompt = (promptText: string): string | null => {
  // Check for currency symbols with amounts
  const currencyPattern = /(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD))/i;
  const currencyMatch = promptText.match(currencyPattern);
  if (currencyMatch) {
    return currencyMatch[1];
  }
  
  // Check for budget range
  const budgetRangePattern = /budget(?:\s+of)?\s+(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD))(?:\s*-\s*|\s+to\s+)(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD))/i;
  const budgetRangeMatch = promptText.match(budgetRangePattern);
  if (budgetRangeMatch) {
    return `${budgetRangeMatch[1]} - ${budgetRangeMatch[2]}`;
  }
  
  // Check for budget amounts with "budget" keyword
  const budgetKeywordPattern = /budget(?:\s+of)?\s+(\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD))/i;
  const budgetKeywordMatch = promptText.match(budgetKeywordPattern);
  if (budgetKeywordMatch) {
    return budgetKeywordMatch[1];
  }
  
  // Check for terms indicating free event
  const freePattern = /\b(free|no cost|zero budget)\b/i;
  const freeMatch = promptText.match(freePattern);
  if (freeMatch) {
    return "Free";
  }
  
  return null;
};
