
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

  const startDate = new Date(dateString);
  if (isNaN(startDate.getTime())) {
    const providedDate = additionalInfo.datetime 
      ? new Date(additionalInfo.datetime)
      : new Date();
    const endDate = new Date(providedDate);
    endDate.setHours(endDate.getHours() + 2);
    return {
      startDate: providedDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};
