
export const formatEventDate = (dateString: string): string => {
  try {
    if (dateString.toLowerCase() === "flexible") {
      return "Flexible Date & Time";
    }

    const date = new Date(dateString);
    
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    return dateString || "Date to be determined";
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Date to be determined";
  }
};
