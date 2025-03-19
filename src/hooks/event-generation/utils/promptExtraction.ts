
/**
 * Utilities for extracting event information from user prompts
 */

/**
 * Extract fields like date, location, and budget from a prompt
 */
export const extractFieldsFromPrompt = (
  prompt: string, 
  data: any,
  providedInfo: Record<string, string> = {}
): Record<string, string> => {
  const prePopulatedInfo: Record<string, string> = { ...providedInfo };
  
  // Match date patterns like "April 1st" or "April 1st, 2023"
  const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+(?:\d{4})?\s*(?:at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
  const simpleDateRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
  
  const dateTimeMatch = prompt.match(dateTimeRegex);
  const simpleDateMatch = !dateTimeMatch ? prompt.match(simpleDateRegex) : null;
  
  // Match location patterns like "in San Francisco" or "at Moscone Center"
  const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
  const locationMatch = prompt.match(locationRegex);

  // Match budget patterns like "$500", "500 dollars", "budget of $500"
  const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+)(?:\s+(?:dollars|USD))?/i;
  const budgetMatch = prompt.match(budgetRegex);

  // Only extract date if we don't already have one in providedInfo
  if (!prePopulatedInfo.date && (dateTimeMatch || simpleDateMatch)) {
    const dateStr = dateTimeMatch ? dateTimeMatch[1] : (simpleDateMatch ? simpleDateMatch[1] : "");
    // If year is missing, add the current year
    const currentYear = new Date().getFullYear();
    const dateWithYear = dateStr.includes(String(currentYear)) ? dateStr : `${dateStr}, ${currentYear}`;
    
    try {
      const date = new Date(dateWithYear);
      if (!isNaN(date.getTime())) {
        prePopulatedInfo.date = date.toISOString();
        console.log(`Extracted date from prompt: ${prePopulatedInfo.date}`);
      } else {
        prePopulatedInfo.date = dateStr; // Use the string as-is if parsing fails
      }
    } catch (e) {
      prePopulatedInfo.date = dateStr;
    }
  }
  
  // Only extract location if we don't already have one in providedInfo
  if (!prePopulatedInfo.location && locationMatch) {
    prePopulatedInfo.location = locationMatch[1].trim();
    console.log(`Extracted location from prompt: ${prePopulatedInfo.location}`);
  }

  // Only extract budget if we don't already have one in providedInfo
  if (!prePopulatedInfo.budget && budgetMatch) {
    prePopulatedInfo.budget = `$${budgetMatch[1]}`;
    console.log(`Extracted budget from prompt: ${prePopulatedInfo.budget}`);
  }
  
  // Ensure missing fields array is properly updated
  if (data && data.missingFields) {
    if (prePopulatedInfo.date && data.missingFields.includes('date')) {
      data.missingFields = data.missingFields.filter((f: string) => f !== 'date');
    }
    
    if (prePopulatedInfo.location && data.missingFields.includes('location')) {
      data.missingFields = data.missingFields.filter((f: string) => f !== 'location');
    }
    
    if (prePopulatedInfo.budget && data.missingFields.includes('budget')) {
      data.missingFields = data.missingFields.filter((f: string) => f !== 'budget');
    }
  }

  return prePopulatedInfo;
};
