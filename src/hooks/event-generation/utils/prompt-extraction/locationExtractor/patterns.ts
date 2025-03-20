
/**
 * Regex patterns for location extraction
 */

// Common location patterns
export const locationPatterns = [
  // Common location patterns
  /(?:in|at)\s+([^,.]+(?:,\s*[^,.]+)?)/i,
  
  // City abbreviations like "SFO", "NYC", "LA"
  /\b(SFO|NYC|LA|SF|CHI|DC|ATL|BOS|SEA|PDX|MIA|AUS|DEN)\b/,
  
  // Common city names without "in" or "at"
  /\b(San Francisco|New York|Los Angeles|Chicago|Washington|Seattle|Portland|Miami|Austin|Denver|Boston|Atlanta|Dallas)\b/i
];
