
export const formatEventDate = (dateString: string, additionalInfo: Record<string, string>) => {
  if (dateString === 'flexible') {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // For 'March 30th' type of dates, parse them correctly
  const monthMatch = dateString.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/i);
  if (monthMatch) {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const month = monthNames.indexOf(monthMatch[1].toLowerCase());
    const day = parseInt(monthMatch[2]);
    const year = monthMatch[3] ? parseInt(monthMatch[3]) : new Date().getFullYear();
    
    // Set time to 9am as a default 
    const startDate = new Date(year, month, day, 9, 0);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // Handle ISO date strings
  const startDate = new Date(dateString);
  if (!isNaN(startDate.getTime())) {
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  // Default fallback using provided datetime or current time
  const providedDate = additionalInfo.datetime 
    ? new Date(additionalInfo.datetime)
    : new Date();
  const endDate = new Date(providedDate);
  endDate.setHours(endDate.getHours() + 2);
  return {
    startDate: providedDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

/**
 * Format a date for display, handling timezone abbreviations
 */
export const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Convert a time zone abbreviation (CT, ET, etc.) to offset hours
 */
export const getTimezoneOffset = (tzAbbr: string): number => {
  const timezoneMap: Record<string, number> = {
    'CT': -6, // Central Time
    'ET': -5, // Eastern Time
    'PT': -8, // Pacific Time
    'MT': -7,  // Mountain Time
    'CST': -6, // Central Standard Time
    'EST': -5, // Eastern Standard Time
    'PST': -8, // Pacific Standard Time
    'MST': -7  // Mountain Standard Time
  };
  
  return timezoneMap[tzAbbr.toUpperCase()] || 0;
};
