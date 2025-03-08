
/**
 * Combines a date value and time value into a single ISO string
 */
export const combineDateTime = (dateValue: Date | string, timeValue: string): string => {
  if (!dateValue) return '';
  
  const date = new Date(dateValue);
  const [hours, minutes] = timeValue.split(':').map(Number);
  
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

/**
 * Formats a date as MM/DD/YYYY
 */
export const formatDateMDY = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${month}/${day}/${year}`;
};

