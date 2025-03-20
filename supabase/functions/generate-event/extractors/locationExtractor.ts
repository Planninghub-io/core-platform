
// Location extraction utilities

/**
 * Extract location from prompt, filtering out time information
 */
export function extractLocation(prompt: string): string | null {
  // First check for specific city/area mentions
  const cityAreaRegex = /(?:in|at)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?\s+(?:Downtown|Center|Square|Park|Area|District|Mall))/i;
  const cityAreaMatch = prompt.match(cityAreaRegex);
  if (cityAreaMatch) {
    return cityAreaMatch[1].trim();
  }
  
  // Check for location with time
  const locationTimeRegex = /(?:in|at)\s+([^,.]+)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i;
  const locationTimeMatch = prompt.match(locationTimeRegex);
  
  if (locationTimeMatch) {
    // Make sure we're not capturing the time in the location
    return cleanLocationString(locationTimeMatch[1].trim());
  }
  
  // Standard location pattern
  const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
  const locationMatch = prompt.match(locationRegex);
  
  // If we found a location, clean it by removing any time information
  if (locationMatch) {
    return cleanLocationString(locationMatch[1].trim());
  }
  
  // Try to extract just a city name if nothing else worked
  const cityNameRegex = /\b(Austin|Dallas|Houston|San Antonio|New York|Los Angeles|Chicago|Boston|Miami|Seattle|Portland|Denver|Atlanta|San Francisco|Nashville|New Orleans|Las Vegas)\b/i;
  const cityMatch = prompt.match(cityNameRegex);
  
  if (cityMatch) {
    return cityMatch[1].trim();
  }
  
  return null;
}

/**
 * Clean up location string by removing time information
 */
export function cleanLocationString(location: string): string {
  return location.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
}
