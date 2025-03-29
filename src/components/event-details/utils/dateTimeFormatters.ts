
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateString || "";
  }
};

export const formatTime = (timeString: string) => {
  try {
    if (!timeString) return "";
    
    // For handling full ISO dates
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return format(date, "h:mm a");
    }
    
    // For handling just time strings
    const time = new Date(`2000-01-01T${timeString}`);
    if (isNaN(time.getTime())) return timeString;
    return format(time, "h:mm a");
  } catch (e) {
    return timeString || "";
  }
};
