
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

  // Check for venue-specific patterns (like "at Leander High School in Leander")
  const venuePattern = /at\s+([^,.]+)(?:\s+in\s+([^,.]+))?/i;
  const venueMatch = normalizedPrompt.match(venuePattern);
  if (venueMatch) {
    // If we have both venue and city, format as "Venue in City"
    if (venueMatch[2]) {
      return `${venueMatch[1].trim()} in ${venueMatch[2].trim()}`;
    }
    return venueMatch[1].trim();
  }

  // Check for city+state pattern ("in Austin, TX" or "in Austin, Texas")
  const cityStatePattern = /in\s+([^,.]+),\s*([^,.]{2,})/i;
  const cityStateMatch = normalizedPrompt.match(cityStatePattern);
  if (cityStateMatch) {
    return `${cityStateMatch[1].trim()}, ${cityStateMatch[2].trim()}`;
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
 * Parse location into city and state components
 * @param location The location string to parse
 * @returns Object with city and state properties
 */
export const parseLocationComponents = (location: string): { city: string; state: string } => {
  if (!location) return { city: '', state: '' };
  
  // Remove common prefixes
  let cleaned = location.replace(/^(at|in)\s+/i, '');
  
  // Check for "City, State" format
  const commaPattern = /([^,]+),\s*([^,]+)$/;
  const commaMatch = cleaned.match(commaPattern);
  if (commaMatch) {
    return { city: commaMatch[1].trim(), state: commaMatch[2].trim() };
  }
  
  // Check for "Venue in City" format
  const inPattern = /(.+)\s+in\s+([^,]+)/i;
  const inMatch = cleaned.match(inPattern);
  if (inMatch) {
    return { city: inMatch[2].trim(), state: '' };
  }
  
  // Check for city + state abbreviation
  const stateAbbrPattern = /(.+)\s+([A-Z]{2})$/;
  const stateAbbrMatch = cleaned.match(stateAbbrPattern);
  if (stateAbbrMatch) {
    return { city: stateAbbrMatch[1].trim(), state: stateAbbrMatch[2] };
  }
  
  // If all else fails, assume the whole thing is a city
  return { city: cleaned, state: '' };
};
