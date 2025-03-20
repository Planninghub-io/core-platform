
// Date and time extraction utilities

/**
 * Extract date and time from prompt, better handling of time zones
 */
export function extractDateTime(prompt: string): string | null {
  // Match patterns with time zones (CT, ET, etc.)
  const timeZoneRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}?)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\s*(?:CT|ET|PT|MT)?)?/i;
  const timeZoneMatch = prompt.match(timeZoneRegex);
  
  if (timeZoneMatch) {
    return timeZoneMatch[1].trim();
  }
  
  // Standard date/time pattern
  const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
  const dateTimeMatch = prompt.match(dateTimeRegex);
  
  // Month and day pattern (e.g., "March 30th")
  if (!dateTimeMatch) {
    const monthDayRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?)/i;
    const monthDayMatch = prompt.match(monthDayRegex);
    
    if (monthDayMatch) {
      return monthDayMatch[1].trim();
    }
  }
  
  return dateTimeMatch ? dateTimeMatch[1].trim() : null;
}
