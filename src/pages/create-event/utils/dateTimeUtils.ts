
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
