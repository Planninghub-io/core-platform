
/**
 * Utility functions for extracting date information from user prompts
 */

/**
 * Extract date from a user prompt
 * @param promptText The user prompt to analyze
 * @returns The extracted date string or null if not found
 */
export const extractDateFromPrompt = (promptText: string): string | null => {
  // Check for exact date formats (e.g., "April 24th at 5 PM")
  const dateTimePattern = /([A-Z][a-z]+ \d+(?:st|nd|rd|th)? at \d+(?::\d+)? (?:AM|PM|am|pm))/i;
  const dateTimeMatch = promptText.match(dateTimePattern);
  if (dateTimeMatch) {
    return dateTimeMatch[1];
  }
  
  // Check for more date formats
  const datePattern = /([A-Z][a-z]+ \d+(?:st|nd|rd|th)?(?:,? \d{4})?)/i;
  const dateMatch = promptText.match(datePattern);
  if (dateMatch) {
    return dateMatch[1];
  }
  
  // Check for relative dates
  const relativeDatePattern = /(today|tomorrow|next week|next month|this weekend)/i;
  const relativeDateMatch = promptText.match(relativeDatePattern);
  if (relativeDateMatch) {
    return relativeDateMatch[1];
  }
  
  // Check for day with time pattern
  const dayTimePattern = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) at (\d+(?::\d+)? (?:AM|PM|am|pm))/i;
  const dayTimeMatch = promptText.match(dayTimePattern);
  if (dayTimeMatch) {
    return dayTimeMatch[0];
  }
  
  return null;
};
