
/**
 * Location extraction utilities
 */

// Map of common city abbreviations
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

// Common location patterns
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
export const cleanLocationString = (location: string): string => {
  let cleanLocation = location.trim();
  // Remove time patterns from location
  cleanLocation = cleanLocation.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
  return cleanLocation;
};

/**
 * Check for special case locations
 */
export const checkSpecialLocations = (promptText: string): string | null => {
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
