
export const formatEventDate = (dateString: string): string => {
  try {
    // Handle flexible date case
    if (dateString.toLowerCase() === "flexible") {
      return "Flexible Date & Time";
    }

    // Try to parse the date
    const date = new Date(dateString);
    
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      // Format the date with weekday, month, day, year, and time
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    // Return the original string if parsing fails, or a fallback
    return dateString || "Date to be determined";
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Date to be determined";
  }
};
