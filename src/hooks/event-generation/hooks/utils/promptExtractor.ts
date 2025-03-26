
/**
 * Extract information from the prompt to add to additionalInfo
 */
export const extractInfoFromPrompt = (prompt: string): Record<string, string> => {
  const combinedInfo: Record<string, string> = {};
  
  // Check for attendees information
  if (prompt.toLowerCase().includes("attendees") || prompt.toLowerCase().includes("guests")) {
    const attendeesMatch = prompt.match(/(\d+)\s*(attendees|guests|people)/i);
    if (attendeesMatch) {
      combinedInfo.attendees = attendeesMatch[1];
    }
  }
  
  // Check for budget information
  if (prompt.toLowerCase().includes("budget") || prompt.toLowerCase().includes("cost")) {
    const budgetMatch = prompt.match(/\$?(\d+)(?:,\d+)?(?:\.\d+)?\s*(budget|cost)/i);
    if (budgetMatch) {
      combinedInfo.budget = budgetMatch[1];
    }
  }
  
  // Check for location information
  if (prompt.toLowerCase().includes("location") || prompt.toLowerCase().includes("place")) {
    const locationMatch = prompt.match(/(?:location|place|at|in)\s*:\s*([^,\.]+)/i);
    if (locationMatch) {
      combinedInfo.location = locationMatch[1].trim();
    }
  }
  
  return combinedInfo;
};
