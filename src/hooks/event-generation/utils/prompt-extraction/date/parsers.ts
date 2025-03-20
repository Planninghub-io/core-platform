
/**
 * Various date format parsers
 */
import { monthNames, timeZoneMap } from './constants';

/**
 * Parse a short date format (MM/DD/YYYY)
 */
export const parseShortDateFormat = (matchedText: string): Date | null => {
  try {
    const parts = matchedText.split('/');
    const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
    const day = parseInt(parts[1]);
    const year = parts[2] && parts[2].length === 4 
      ? parseInt(parts[2]) 
      : new Date().getFullYear();
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    console.error("Error parsing short date format:", e);
    return null;
  }
};

/**
 * Parse a time string and return hours and minutes
 */
export const parseTimeString = (timeMatch: RegExpMatchArray | null): { hours: number, minutes: number } | null => {
  if (!timeMatch) return null;
  
  try {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const isPM = timeMatch[3]?.toLowerCase() === 'pm';
    
    let adjustedHours = hours;
    if (isPM && hours < 12) adjustedHours += 12;
    if (!isPM && hours === 12) adjustedHours = 0;
    
    return { hours: adjustedHours, minutes };
  } catch (e) {
    console.error("Error parsing time string:", e);
    return null;
  }
};

/**
 * Handle relative dates like "tomorrow" or "next Monday"
 */
export const handleRelativeDate = (matchedText: string): Date | null => {
  try {
    if (matchedText.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    } 
    
    const dayOfWeekMatch = matchedText.match(/(?:next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
    if (dayOfWeekMatch) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = dayNames.indexOf(dayOfWeekMatch[1].toLowerCase());
      
      const today = new Date();
      const currentDay = today.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Move to next week if day has passed
      if (matchedText.includes('next')) daysToAdd += 7; // "Next" means the week after this one
      
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysToAdd);
      return targetDate;
    }
    
    return null;
  } catch (e) {
    console.error("Error handling relative date:", e);
    return null;
  }
};

/**
 * Parse date with month name format
 */
export const parseMonthNameDate = (
  matchedText: string, 
  promptText: string
): Date | null => {
  try {
    // Extract month
    let month = -1;
    for (let i = 0; i < monthNames.length; i++) {
      if (matchedText.toLowerCase().includes(monthNames[i])) {
        month = i;
        break;
      }
    }
    
    // Extract day
    const dayMatch = matchedText.match(/\d{1,2}(?:st|nd|rd|th)?/);
    const day = dayMatch ? parseInt(dayMatch[0]) : 1;
    
    // Extract year if present, otherwise use current year
    const yearMatch = matchedText.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
    
    // Extract time if present
    const timeMatch = matchedText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    const timeInfo = parseTimeString(timeMatch);
    
    let hours = timeInfo?.hours ?? 9; // Default to 9 AM if no time specified
    let minutes = timeInfo?.minutes ?? 0;
    
    // Check for time zone abbreviations
    const timeZoneMatch = promptText.match(/\b(ct|et|pt|mt)\b/i);
    if (timeZoneMatch && month >= 0 && day > 0) {
      const tzAbbr = timeZoneMatch[1].toLowerCase();
      const tzOffset = timeZoneMap[tzAbbr];
      
      // Adjust for time zone
      const date = new Date(Date.UTC(year, month, day, hours - tzOffset, minutes));
      return date;
    } else if (month >= 0 && day > 0) {
      const date = new Date(year, month, day, hours, minutes);
      return date;
    }
    
    return null;
  } catch (e) {
    console.error("Error parsing month name date:", e);
    return null;
  }
};
