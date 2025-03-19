
/**
 * Utilities for extracting event information from user prompts
 */

/**
 * Extract date from prompt text with improved pattern recognition
 * @param promptText The user prompt to analyze
 * @returns Extracted date in ISO format or null if not found
 */
export const extractDateFromPrompt = (promptText: string): string | null => {
  // Standardize the prompt text for better matching
  const normalizedPrompt = promptText.toLowerCase().trim();
  
  // Common date patterns with more variations
  const patterns = [
    // Full format with month name: "March 20th at 6PM" or "March 20th, 2023 at 6PM"
    /(?:on\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm))?/i,
    
    // Short date format: "3/20/2023" or "3/20/23" or "03/20/2023"
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
    
    // Date with day of week: "Monday, March 20th" or "Monday March 20"
    /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?/i,
    
    // Time only mention, which we'll combine with current date: "6PM" or "6:00 PM"
    /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i,
    
    // Relative dates: "next Monday", "this Friday", "tomorrow"
    /\b(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\btomorrow\b/i
  ];
  
  // Try each pattern until we find a match
  for (const pattern of patterns) {
    const match = normalizedPrompt.match(pattern);
    if (match) {
      try {
        const matchedText = match[0];
        const currentYear = new Date().getFullYear();
        
        // Handle different date formats
        if (matchedText.includes('/')) {
          // Handle MM/DD/YYYY format
          const parts = matchedText.split('/');
          const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
          const day = parseInt(parts[1]);
          const year = parts[2] && parts[2].length === 4 ? parseInt(parts[2]) : currentYear;
          
          const date = new Date(year, month, day);
          return date.toISOString();
        } else if (matchedText.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i)) {
          // Time only, use current date
          const timeMatch = matchedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const isPM = timeMatch[3].toLowerCase() === 'pm';
            
            const date = new Date();
            date.setHours(isPM && hours < 12 ? hours + 12 : hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            
            return date.toISOString();
          }
        } else if (matchedText.includes('tomorrow')) {
          // Handle "tomorrow"
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString();
        } else if (matchedText.match(/(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)) {
          // Handle "next Monday" or "this Friday"
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
            return targetDate.toISOString();
          }
        } else {
          // Handle month name format
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          
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
          const year = yearMatch ? parseInt(yearMatch[0]) : currentYear;
          
          // Extract time if present
          let hours = 0;
          let minutes = 0;
          
          const timeMatch = matchedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
          if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const isPM = timeMatch[3].toLowerCase() === 'pm';
            
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
          }
          
          if (month >= 0 && day > 0) {
            const date = new Date(year, month, day, hours, minutes);
            return date.toISOString();
          }
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
 * Extract location from prompt text
 * @param promptText The user prompt to analyze
 * @returns Extracted location string or null if not found
 */
export const extractLocationFromPrompt = (promptText: string): string | null => {
  // Normalize the prompt
  const normalizedPrompt = promptText.trim();
  
  // Multiple patterns for location
  const patterns = [
    // Common location patterns
    /(?:in|at)\s+([^,.]+(?:,\s*[^,.]+)?)/i,
    
    // City abbreviations like "SFO", "NYC", "LA"
    /\b(SFO|NYC|LA|SF|CHI|DC|ATL|BOS|SEA|PDX|MIA|AUS|DEN)\b/,
    
    // Common city names without "in" or "at"
    /\b(San Francisco|New York|Los Angeles|Chicago|Washington|Seattle|Portland|Miami|Austin|Denver|Boston|Atlanta)\b/i
  ];
  
  for (const pattern of patterns) {
    const match = normalizedPrompt.match(pattern);
    if (match) {
      // If it's a city abbreviation, convert to full name
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
      
      const locationText = match[1] || match[0];
      if (cityAbbreviations[locationText.toUpperCase()]) {
        return cityAbbreviations[locationText.toUpperCase()];
      }
      
      return locationText.trim();
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
  
  // Multiple patterns for budget
  const patterns = [
    // Standard budget format with dollar sign
    /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)(?:\s+(?:dollars|USD))?/i,
    
    // Budget ranges
    /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i,
    
    // Budget with K or M abbreviation
    /(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)\s*[KkMm]\b/i
  ];
  
  // Check for special budget mentions first
  if (normalizedPrompt.includes('free event') || 
      normalizedPrompt.includes('no budget') ||
      normalizedPrompt.includes('zero budget')) {
    return 'Free';
  }
  
  // Check for budget range first
  const rangeMatch = normalizedPrompt.match(/(?:budget(?:\s+of)?\s+)?\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*-\s*\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
  if (rangeMatch) {
    const min = rangeMatch[1].replace(/,/g, '');
    const max = rangeMatch[2].replace(/,/g, '');
    return `$${min}-$${max}`;
  }
  
  // Check for K or M abbreviations
  const abbreviationMatch = normalizedPrompt.match(/(?:budget(?:\s+of)?\s+)?\$?(\d+(?:\.\d+)?)\s*([KkMm])\b/i);
  if (abbreviationMatch) {
    const num = parseFloat(abbreviationMatch[1]);
    const unit = abbreviationMatch[2].toLowerCase();
    
    if (unit === 'k') {
      return `$${num * 1000}`;
    } else if (unit === 'm') {
      return `$${num * 1000000}`;
    }
  }
  
  // Try other patterns
  for (const pattern of patterns) {
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
