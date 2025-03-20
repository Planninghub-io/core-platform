
/**
 * Date extraction utilities
 */

// Date extraction patterns
const datePatterns = [
  // Full format with month name: "March 20th at 6PM" or "March 20th, 2023 at 6PM"
  /(?:on\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?(?:\s+at\s+\d{1,2}(?::(\d{2}))?\s*(?:am|pm))?/i,
  
  // Short date format: "3/20/2023" or "3/20/23" or "03/20/2023"
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
  
  // Date with day of week: "Monday, March 20th" or "Monday March 20"
  /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?/i,
  
  // Time only mention, which we'll combine with current date: "6PM" or "6:00 PM"
  /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i,
  
  // Relative dates: "next Monday", "this Friday", "tomorrow"
  /\b(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\btomorrow\b/i,
  
  // Month and day without year: "March 30th"
  /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?\b/i
];

const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december'];

const timeZoneMap: Record<string, number> = {
  'ct': -6, // Central Time
  'et': -5, // Eastern Time
  'pt': -8, // Pacific Time
  'mt': -7  // Mountain Time
};

/**
 * Parse a short date format (MM/DD/YYYY)
 */
export const parseShortDateFormat = (matchedText: string): Date | null => {
  try {
    const parts = matchedText.split('/');
    const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
    const day = parseInt(parts[1]);
    const year = parts[2] && parts[2].length === 4 
      ? parseInt(parts[2]) 
      : new Date().getFullYear();
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.error("Error parsing short date format:", e);
    return null;
  }
};

/**
 * Parse a time string and return hours and minutes
 */
export const parseTimeString = (timeMatch: RegExpMatchArray | null): { hours: number, minutes: number } | null => {
  if (!timeMatch) return null;
  
  try {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const isPM = timeMatch[3]?.toLowerCase() === 'pm';
    
    let adjustedHours = hours;
    if (isPM && hours < 12) adjustedHours += 12;
    if (!isPM && hours === 12) adjustedHours = 0;
    
    return { hours: adjustedHours, minutes };
  } catch (e) {
    console.error("Error parsing time string:", e);
    return null;
  }
};

/**
 * Handle relative dates like "tomorrow" or "next Monday"
 */
export const handleRelativeDate = (matchedText: string): Date | null => {
  try {
    if (matchedText.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    } 
    
    const dayOfWeekMatch = matchedText.match(/(?:next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
    if (dayOfWeekMatch) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = dayNames.indexOf(dayOfWeekMatch[1].toLowerCase());
      
      const today = new Date();
      const currentDay = today.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Move to next week if day has passed
      if (matchedText.includes('next')) daysToAdd += 7; // "Next" means the week after this one
      
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysToAdd);
      return targetDate;
    }
    
    return null;
  } catch (e) {
    console.error("Error handling relative date:", e);
    return null;
  }
};

/**
 * Parse date with month name format
 */
export const parseMonthNameDate = (
  matchedText: string, 
  promptText: string
): Date | null => {
  try {
    // Extract month
    let month = -1;
    for (let i = 0; i < monthNames.length; i++) {
      if (matchedText.toLowerCase().includes(monthNames[i])) {
        month = i;
        break;
      }
    }
    
    // Extract day
    const dayMatch = matchedText.match(/\d{1,2}(?:st|nd|rd|th)?/);
    const day = dayMatch ? parseInt(dayMatch[0]) : 1;
    
    // Extract year if present, otherwise use current year
    const yearMatch = matchedText.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
    
    // Extract time if present
    const timeMatch = matchedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    const timeInfo = parseTimeString(timeMatch);
    
    let hours = timeInfo?.hours ?? 9; // Default to 9 AM if no time specified
    let minutes = timeInfo?.minutes ?? 0;
    
    // Check for time zone abbreviations
    const timeZoneMatch = promptText.match(/\b(ct|et|pt|mt)\b/i);
    if (timeZoneMatch && month >= 0 && day > 0) {
      const tzAbbr = timeZoneMatch[1].toLowerCase();
      const tzOffset = timeZoneMap[tzAbbr];
      
      // Adjust for time zone
      const date = new Date(Date.UTC(year, month, day, hours - tzOffset, minutes));
      return date;
    } else if (month >= 0 && day > 0) {
      const date = new Date(year, month, day, hours, minutes);
      return date;
    }
    
    return null;
  } catch (e) {
    console.error("Error parsing month name date:", e);
    return null;
  }
};

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
