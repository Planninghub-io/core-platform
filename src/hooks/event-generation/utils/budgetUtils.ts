/**
 * Utilities for budget extraction and formatting
 */

/**
 * Extracts budget information from a user message
 * @param message User message text
 * @returns Formatted budget string or null if no budget found
 */
export const extractBudgetFromMessage = (message: string): string | null => {
  // Check for explicit budget mentions using regex
  const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)(?:\s*(?:dollars|USD|$))?/i;
  const budgetMatch = message.match(budgetRegex);
  
  if (budgetMatch) {
    // Return formatted budget with dollar sign
    return `$${budgetMatch[1]}`;
  }
  
  // Check for "free" or "no budget" mentions
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes('free') || 
    lowerMessage.includes('no budget') || 
    lowerMessage.includes('no cost') ||
    lowerMessage.includes('zero budget') ||
    lowerMessage.includes('$0')
  ) {
    return 'Free';
  }
  
  return null;
};

/**
 * Formats a budget value for display
 * @param budget Budget value (numeric or string)
 * @returns Formatted budget string with currency symbol
 */
export const formatBudget = (budget: string | number | undefined): string => {
  if (!budget) return '';
  
  // If it's already a string with a currency symbol, return as is
  if (typeof budget === 'string' && budget.startsWith('$')) {
    return budget;
  }
  
  // If it's "Free" or similar, return as is
  if (typeof budget === 'string' && 
      (budget.toLowerCase() === 'free' || budget.toLowerCase() === 'no budget')) {
    return budget;
  }
  
  // Otherwise format as currency
  const numericValue = typeof budget === 'string' ? parseFloat(budget) : budget;
  if (isNaN(numericValue)) return '';
  
  return `$${numericValue}`;
};
