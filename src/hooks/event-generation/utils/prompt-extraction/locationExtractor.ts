
/**
 * Utility functions for extracting location information from user prompts
 */

/**
 * Extract location from a user prompt
 * @param promptText The user prompt to analyze
 * @returns The extracted location string or null if not found
 */
export const extractLocationFromPrompt = (promptText: string): string | null => {
  // Check for "in [location]" or "at [location]" patterns
  const inAtLocationPattern = /(?:in|at) ([A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?)/i;
  const inAtLocationMatch = promptText.match(inAtLocationPattern);
  if (inAtLocationMatch) {
    return inAtLocationMatch[1].trim();
  }
  
  // Check for city names with state abbreviations
  const cityStatePattern = /([A-Za-z\s]+),\s*([A-Z]{2})/;
  const cityStateMatch = promptText.match(cityStatePattern);
  if (cityStateMatch) {
    return `${cityStateMatch[1]}, ${cityStateMatch[2]}`;
  }
  
  // Check for common venue types
  const venuePattern = /((?:the )?\w+\s+(?:Hotel|Center|Hall|Place|Venue|Conference Center|Stadium|Arena|Theater|Theatre))/i;
  const venueMatch = promptText.match(venuePattern);
  if (venueMatch) {
    return venueMatch[1];
  }
  
  return null;
};

/**
 * Parse a location string into city and state components
 * @param locationStr The location string to parse
 * @returns Object with city and state properties
 */
export const parseLocationComponents = (locationStr: string): { city: string; state: string } => {
  // Extract city and state if in format "City, State"
  const cityStatePattern = /([^,]+),\s*([A-Za-z\s]+)$/;
  const match = locationStr.match(cityStatePattern);
  
  if (match) {
    return {
      city: match[1].trim(),
      state: match[2].trim()
    };
  }
  
  // If no match, assume it's just a city or venue
  return {
    city: locationStr.trim(),
    state: ''
  };
};
