
/**
 * Combines a date string/object and a time string into a single Date object
 * @param date Date string or object
 * @param time Time string in "HH:MM" format
 * @returns ISO string of the combined date and time
 */
export const combineDateTime = (date: string | Date, time: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    // Invalid date, return current date/time
    return new Date().toISOString();
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  
  dateObj.setHours(hours || 0);
  dateObj.setMinutes(minutes || 0);
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);
  
  return dateObj.toISOString();
};

/**
 * Formats a date as MM/DD/YYYY
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export const formatDateMDY = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${month}/${day}/${year}`;
};
