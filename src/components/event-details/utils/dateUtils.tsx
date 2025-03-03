
import { format } from "date-fns";

export const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

export const formatTimeOnly = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "HH:mm");
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
};

export const combineDateTime = (dateValue: string, timeValue: string, originalDateTime: string): string => {
  try {
    const originalDate = new Date(originalDateTime);
    const [year, month, day] = dateValue.split('-').map(num => parseInt(num, 10));
    const [hours, minutes] = timeValue.split(':').map(num => parseInt(num, 10));
    
    const newDate = new Date(originalDate);
    newDate.setFullYear(year, month - 1, day);
    newDate.setHours(hours, minutes);
    
    return newDate.toISOString();
  } catch (error) {
    console.error("Error combining date and time:", error);
    return originalDateTime;
  }
};
