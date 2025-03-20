
/**
 * Main date extraction utility
 */
import { datePatterns } from './constants';
import { 
  parseShortDateFormat, 
  parseTimeString, 
  handleRelativeDate, 
  parseMonthNameDate 
} from './parsers';

/**
 * Extract date from prompt text with improved pattern recognition
 * @param promptText The user prompt to analyze
 * @returns Extracted date in ISO format or null if not found
 */
export const extractDateFromPrompt = (promptText: string): string | null => {
  // Standardize the prompt text for better matching
  const normalizedPrompt = promptText.toLowerCase().trim();
  
  // Try each pattern until we find a match
  for (const pattern of datePatterns) {
    const match = normalizedPrompt.match(pattern);
    if (match) {
      try {
        const matchedText = match[0];
        
        // Handle different date formats
        if (matchedText.includes('/')) {
          const date = parseShortDateFormat(matchedText);
          return date?.toISOString() || null;
        } else if (matchedText.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i)) {
          // Time only, use current date
          const timeMatch = matchedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
          const timeInfo = parseTimeString(timeMatch);
          
          if (timeInfo) {
            const date = new Date();
            date.setHours(timeInfo.hours);
            date.setMinutes(timeInfo.minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            
            return date.toISOString();
          }
        } else if (matchedText.includes('tomorrow') || 
                  matchedText.match(/(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)) {
          const date = handleRelativeDate(matchedText);
          return date?.toISOString() || null;
        } else {
          // Handle month name format
          const date = parseMonthNameDate(matchedText, normalizedPrompt);
          return date?.toISOString() || null;
        }
      } catch (e) {
        console.error("Error parsing date:", e);
        // Continue to next pattern
      }
    }
  }
  
  return null;
};
