
/**
 * Utilities for extracting event information from user prompts
 */

/**
 * Date extraction utilities
 */
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
const parseShortDateFormat = (matchedText: string): Date | null => {
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
const parseTimeString = (timeMatch: RegExpMatchArray | null): { hours: number, minutes: number } | null => {
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
const handleRelativeDate = (matchedText: string): Date | null => {
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
const parseMonthNameDate = (
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

/**
 * Location extraction utilities
 */
const cityAbbreviations: Record<string, string> = {
  'SFO': 'San Francisco',
  'SF': 'San Francisco',
  'NYC': 'New York',
  'LA': 'Los Angeles',
  'CHI': 'Chicago',
  'DC': 'Washington DC',
  'ATL': 'Atlanta',
  'BOS': 'Boston',
  'SEA': 'Seattle',
  'PDX': 'Portland',
  'MIA': 'Miami',
  'AUS': 'Austin',
  'DEN': 'Denver'
};

const locationPatterns = [
  // Common location patterns
  /(?:in|at)\s+([^,.]+(?:,\s*[^,.]+)?)/i,
  
  // City abbreviations like "SFO", "NYC", "LA"
  /\b(SFO|NYC|LA|SF|CHI|DC|ATL|BOS|SEA|PDX|MIA|AUS|DEN)\b/,
  
  // Common city names without "in" or "at"
  /\b(San Francisco|New York|Los Angeles|Chicago|Washington|Seattle|Portland|Miami|Austin|Denver|Boston|Atlanta|Dallas)\b/i
];

/**
 * Remove time information from location string
 */
const cleanLocationString = (location: string): string => {
  let cleanLocation = location.trim();
  // Remove time patterns from location
  cleanLocation = cleanLocation.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
  return cleanLocation;
};

/**
 * Check for special case locations
 */
const checkSpecialLocations = (promptText: string): string | null => {
  // Check for specific city areas like "Austin Downtown"
  const cityAreaMatch = promptText.match(/\b((?:Austin|Dallas|Houston|New York|Chicago|Los Angeles|San Francisco|Miami|Boston)\s+(?:Downtown|Center|Square|Park|Area|District|Mall))\b/i);
  if (cityAreaMatch) {
    return cityAreaMatch[1].trim();
  }

  // Handle specific cases for tailgate events
  if (promptText.toLowerCase().includes('longhorn') && 
      promptText.toLowerCase().includes('tailgate')) {
    return 'Austin Downtown';
  }
  
  return null;
};

/**
 * Extract location from prompt text with improved city recognition
 * @param promptText The user prompt to analyze
 * @returns Extracted location string or null if not found
 */
export const extractLocationFromPrompt = (promptText: string): string | null => {
  // Normalize the prompt
  const normalizedPrompt = promptText.trim();
  
  // Check for special locations first
  const specialLocation = checkSpecialLocations(normalizedPrompt);
  if (specialLocation) {
    return specialLocation;
  }

  // Check if there are time patterns within location mentions
  // and extract only the location part
  const timeLocationMatch = normalizedPrompt.match(/(?:in|at)\s+([^,.]+)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
  if (timeLocationMatch) {
    return cleanLocationString(timeLocationMatch[1]);
  }
  
  // Try different location patterns
  for (const pattern of locationPatterns) {
    const match = normalizedPrompt.match(pattern);
    if (match) {
      const locationText = match[1] || match[0];
      let cleanLocation = cleanLocationString(locationText);
      
      // Check if it's a city abbreviation
      if (cityAbbreviations[cleanLocation.toUpperCase()]) {
        return cityAbbreviations[cleanLocation.toUpperCase()];
      }
      
      return cleanLocation;
    }
  }
  
  return null;
};

/**
 * Budget extraction utilities
 */
const budgetPatterns = [
  // Standard budget format with dollar sign
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)(?:\s+(?:dollars|USD))?/i,
  
  // Budget ranges
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i,
  
  // Budget with K or M abbreviation
  /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)\s*[KkMm]\b/i
];

/**
 * Check for special budget mentions
 */
const checkSpecialBudgetMentions = (promptText: string): string | null => {
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
const parseBudgetRange = (promptText: string): string | null => {
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
const parseBudgetAbbreviation = (promptText: string): string | null => {
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

/**
 * Extract multiple fields from a prompt and combine with existing data
 * 
 * @param promptText The user prompt to analyze
 * @param missingInfoData Data about what fields are missing
 * @param existingInfo Existing information already provided
 * @returns Object containing extracted fields merged with existing info
 */
export const extractFieldsFromPrompt = (
  promptText: string, 
  missingInfoData: any, 
  existingInfo: Record<string, string>
): Record<string, string> => {
  const prePopulatedInfo = { ...existingInfo };
  
  // Extract date if it's needed and not already provided
  if (missingInfoData.missingFields.includes('date') && !prePopulatedInfo.date) {
    const extractedDate = extractDateFromPrompt(promptText);
    if (extractedDate) {
      prePopulatedInfo.date = extractedDate;
    }
  }
  
  // Extract location if it's needed and not already provided
  if (missingInfoData.missingFields.includes('location') && !prePopulatedInfo.location) {
    const extractedLocation = extractLocationFromPrompt(promptText);
    if (extractedLocation) {
      prePopulatedInfo.location = extractedLocation;
    }
  }
  
  // Extract budget if it's needed and not already provided
  if (missingInfoData.missingFields.includes('budget') && !prePopulatedInfo.budget) {
    const extractedBudget = extractBudgetFromPrompt(promptText);
    if (extractedBudget) {
      prePopulatedInfo.budget = extractedBudget;
    }
  }
  
  return prePopulatedInfo;
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

/**
 * Check if a prompt response already contains requested information
 * @param promptText User's response text to analyze
 * @param requestedFields Array of fields that were requested
 * @returns Object with boolean indicating if all requested fields were provided
 */
export const checkIfResponseContainsRequestedInfo = (
  promptText: string,
  requestedFields: string[]
): { containsAllInfo: boolean; extractedInfo: Record<string, string | null> } => {
  const extractedInfo: Record<string, string | null> = {};
  
  // Only check fields that were requested
  if (requestedFields.includes('date')) {
    extractedInfo.date = extractDateFromPrompt(promptText);
  }
  
  if (requestedFields.includes('location')) {
    extractedInfo.location = extractLocationFromPrompt(promptText);
  }
  
  if (requestedFields.includes('budget')) {
    extractedInfo.budget = extractBudgetFromPrompt(promptText);
  }
  
  // Check if we found all requested fields
  const containsAllInfo = requestedFields.every(field => 
    extractedInfo[field] !== null && extractedInfo[field] !== undefined
  );
  
  return { containsAllInfo, extractedInfo };
};
