// Date processing utilities

/**
 * Parse and normalize date strings for consistency
 */
export function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    // Handle ISO date strings from frontend
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Keep ISO format but ensure it's valid
        return date.toISOString();
      }
    }
    
    // Handle date strings with time components like "March 20th at 6PM"
    const monthMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/i);
    if (monthMatch) {
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const month = monthNames.indexOf(monthMatch[1].toLowerCase());
      const day = parseInt(monthMatch[2]);
      const year = monthMatch[3] ? parseInt(monthMatch[3]) : new Date().getFullYear();
      
      let hours = 0;
      let minutes = 0;
      
      if (monthMatch[4]) {
        hours = parseInt(monthMatch[4]);
        if (monthMatch[6] && monthMatch[6].toLowerCase() === 'pm' && hours < 12) {
          hours += 12;
        }
        if (monthMatch[6] && monthMatch[6].toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
        
        minutes = monthMatch[5] ? parseInt(monthMatch[5]) : 0;
      }
      
      const date = new Date(year, month, day, hours, minutes);
      return date.toISOString();
    }
    
    // Parse time zone abbreviations like "CT", "ET", etc.
    if (dateStr.match(/\b(CT|ET|PT|MT)\b/i)) {
      const timeZoneMap: Record<string, number> = {
        'CT': -6, // Central Time
        'ET': -5, // Eastern Time
        'PT': -8, // Pacific Time
        'MT': -7  // Mountain Time
      };
      
      // Extract the time zone abbreviation
      const tzMatch = dateStr.match(/\b(CT|ET|PT|MT)\b/i);
      if (tzMatch) {
        const tzAbbr = tzMatch[1].toUpperCase();
        const tzOffset = timeZoneMap[tzAbbr];
        
        // Extract date and time components
        const dateTimeMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/i);
        
        if (dateTimeMatch) {
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          const month = monthNames.indexOf(dateTimeMatch[1].toLowerCase());
          const day = parseInt(dateTimeMatch[2]);
          const year = dateTimeMatch[3] ? parseInt(dateTimeMatch[3]) : new Date().getFullYear();
          
          let hours = 0;
          let minutes = 0;
          
          if (dateTimeMatch[4]) {
            hours = parseInt(dateTimeMatch[4]);
            if (dateTimeMatch[6] && dateTimeMatch[6].toLowerCase() === 'pm' && hours < 12) {
              hours += 12;
            }
            if (dateTimeMatch[6] && dateTimeMatch[6].toLowerCase() === 'am' && hours === 12) {
              hours = 0;
            }
            
            minutes = dateTimeMatch[5] ? parseInt(dateTimeMatch[5]) : 0;
          }
          
          // Create date in UTC
          const date = new Date(Date.UTC(year, month, day, hours - tzOffset, minutes));
          return date.toISOString();
        }
      }
    }
  } catch (e) {
    console.error('Error normalizing date:', e);
  }
  
  // Return original if we couldn't parse it
  return dateStr;
}
