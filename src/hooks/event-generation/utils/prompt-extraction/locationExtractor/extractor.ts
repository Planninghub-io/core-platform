
/**
 * Main location extraction functionality
 */

import { cityAbbreviations } from './constants';
import { locationPatterns } from './patterns';
import { cleanLocationString, checkSpecialLocations } from './cleaners';

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
