
/**
 * Constants used for date extraction
 */

// Month names for parsing
export const monthNames = [
  'january', 'february', 'march', 'april', 'may', 'june', 
  'july', 'august', 'september', 'october', 'november', 'december'
];

// Common time zone abbreviations and their UTC offsets
export const timeZoneMap: Record<string, number> = {
  'ct': -6, // Central Time
  'et': -5, // Eastern Time
  'pt': -8, // Pacific Time
  'mt': -7, // Mountain Time
  'cst': -6, // Central Standard Time
  'est': -5, // Eastern Standard Time
  'pst': -8, // Pacific Standard Time
  'mst': -7  // Mountain Standard Time
};

// Date extraction patterns
export const datePatterns = [
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
