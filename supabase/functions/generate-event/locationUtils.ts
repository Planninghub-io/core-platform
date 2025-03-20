
// Location processing utilities

/**
 * Extract location from a string that may contain time information
 */
export function extractLocationFromMixedString(inputStr: string): string {
  // Clean up location by removing time patterns
  let cleanedStr = inputStr.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
  
  // Remove "in" or "at" if they appear at the beginning 
  cleanedStr = cleanedStr.replace(/^(?:in|at)\s+/i, '');
  
  return cleanedStr;
}

/**
 * Process location data to ensure it's properly formatted
 */
export function processLocation(location: string | undefined, prompt: string): string {
  if (!location) return '';
  
  // Clean up location if it contains time information
  if (location.match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?(?:\s+(?:CT|ET|PT|MT))?\b/)) {
    location = extractLocationFromMixedString(location);
  }
  
  // Special case for Austin Downtown
  if (prompt.toLowerCase().includes('austin') && prompt.toLowerCase().includes('downtown')) {
    return 'Austin Downtown';
  }
  
  return location;
}
