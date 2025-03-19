
/**
 * Utilities for extracting event information from user prompts
 */

/**
 * Extract date from prompt text
 * @param promptText The user prompt to analyze
 * @returns Extracted date in ISO format or null if not found
 */
export const extractDateFromPrompt = (promptText: string): string | null => {
  // Try to find date patterns in the format "April 1st" or "April 1st, 2023" or with "at 2:00 PM"
  const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+(?:\d{4})?\s*(?:at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
  const simpleDateRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
  
  const dateTimeMatch = promptText.match(dateTimeRegex);
  const simpleDateMatch = !dateTimeMatch ? promptText.match(simpleDateRegex) : null;
  
  if (dateTimeMatch || simpleDateMatch) {
    try {
      const dateStr = dateTimeMatch ? dateTimeMatch[1] : (simpleDateMatch ? simpleDateMatch[1] : "");
      // If year is missing, add the current year
      const currentYear = new Date().getFullYear();
      const dateWithYear = dateStr.includes(String(currentYear)) ? dateStr : `${dateStr}, ${currentYear}`;
      
      const date = new Date(dateWithYear);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      console.error("Error parsing date:", e);
      // Ignore date parsing errors
    }
  }
  return null;
};

/**
 * Extract location from prompt text
 * @param promptText The user prompt to analyze
 * @returns Extracted location string or null if not found
 */
export const extractLocationFromPrompt = (promptText: string): string | null => {
  // Match "in City", "at Place", "in City, State"
  const locationRegex = /(?:in|at)\s+([^,.]+(?:,\s*[^,.]+)?)/i;
  const locationMatch = promptText.match(locationRegex);
  
  if (locationMatch) {
    return locationMatch[1].trim();
  }
  
  return null;
};

/**
 * Extract budget information from prompt text
 * @param promptText The user prompt to analyze
 * @returns Formatted budget string or null if not found
 */
export const extractBudgetFromPrompt = (promptText: string): string | null => {
  // Match "$500", "500 dollars", "budget of $500"
  const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+)(?:\s+(?:dollars|USD))?/i;
  const budgetMatch = promptText.match(budgetRegex);
  
  if (budgetMatch) {
    return `$${budgetMatch[1]}`;
  }
  
  // Check for free events
  if (promptText.toLowerCase().includes('free event') || 
      promptText.toLowerCase().includes('no budget') ||
      promptText.toLowerCase().includes('zero budget')) {
    return 'Free';
  }
  
  return null;
};

/**
 * Main extraction function to get all event details from a prompt
 * @param promptText The user prompt to analyze
 * @returns Object containing extracted fields
 */
export const extractAllDetailsFromPrompt = (promptText: string): Record<string, string | null> => {
  return {
    date: extractDateFromPrompt(promptText),
    location: extractLocationFromPrompt(promptText),
    budget: extractBudgetFromPrompt(promptText)
  };
};
