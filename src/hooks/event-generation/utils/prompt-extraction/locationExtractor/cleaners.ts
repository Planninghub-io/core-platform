
/**
 * Utility functions to clean location strings
 */

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
