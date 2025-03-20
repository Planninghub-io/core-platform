
/**
 * Budget extraction utilities
 */

// Budget patterns to match in prompts
const budgetPatterns = [
  // Standard budget format with dollar sign
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)(?:\s+(?:dollars|USD))?/i,
  
  // Budget ranges
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i,
  
  // Budget with K or M abbreviation
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)\s*[KkMm]\b/i
];

/**
 * Check for special budget mentions like "free event"
 */
export const checkSpecialBudgetMentions = (promptText: string): string | null => {
  if (promptText.includes('free event') || 
      promptText.includes('no budget') ||
      promptText.includes('zero budget')) {
    return 'Free';
  }
  return null;
};

/**
 * Parse budget range (e.g., "$100-$200")
 */
export const parseBudgetRange = (promptText: string): string | null => {
  const rangeMatch = promptText.match(/(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
  if (rangeMatch) {
    const min = rangeMatch[1].replace(/,/g, '');
    const max = rangeMatch[2].replace(/,/g, '');
    return `$${min}-$${max}`;
  }
  return null;
};

/**
 * Parse budget with K or M abbreviation
 */
export const parseBudgetAbbreviation = (promptText: string): string | null => {
  const abbreviationMatch = promptText.match(/(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)\s*([KkMm])\b/i);
  if (abbreviationMatch) {
    const num = parseFloat(abbreviationMatch[1]);
    const unit = abbreviationMatch[2].toLowerCase();
    
    if (unit === 'k') {
      return `$${num * 1000}`;
    } else if (unit === 'm') {
      return `$${num * 1000000}`;
    }
  }
  return null;
};

/**
 * Extract budget information from prompt text
 * @param promptText The user prompt to analyze
 * @returns Formatted budget string or null if not found
 */
export const extractBudgetFromPrompt = (promptText: string): string | null => {
  // Normalize the prompt
  const normalizedPrompt = promptText.toLowerCase().trim();
  
  // Check for special budget mentions first
  const specialBudget = checkSpecialBudgetMentions(normalizedPrompt);
  if (specialBudget) return specialBudget;
  
  // Check for budget range
  const budgetRange = parseBudgetRange(normalizedPrompt);
  if (budgetRange) return budgetRange;
  
  // Check for K or M abbreviations
  const abbreviationBudget = parseBudgetAbbreviation(normalizedPrompt);
  if (abbreviationBudget) return abbreviationBudget;
  
  // Try other patterns
  for (const pattern of budgetPatterns) {
    const match = normalizedPrompt.match(pattern);
    if (match && !match[0].includes('-') && !match[0].toLowerCase().match(/[km]\b/)) {
      const amount = match[1].replace(/,/g, '');
      return `$${amount}`;
    }
  }
  
  return null;
};
