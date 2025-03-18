
import { GeneratedEvent } from "../types";

export interface ValidationResult {
  validatedEvent: GeneratedEvent;
  missing: string[];
}

export const validateEventData = (
  data: any,
  providedInfo: Record<string, string> = {}
): ValidationResult => {
  // Create event object, allowing for missing fields
  const validatedEvent: GeneratedEvent = {
    title: data.title?.trim() || 'Enter Event Name',
    description: data.description || '',
    date: providedInfo.date || data.date || '',
    location: providedInfo.location || data.location || '',
    category: data.category || 'Other',
    estimatedPrice: providedInfo.budget || data.estimatedPrice || 'Free',
    imagePrompt: data.imagePrompt || 'event',
    imageUrl: data.imageUrl || '',
  };

  // Check for missing critical fields, but respect provided info
  const missing: string[] = [];
  if (!validatedEvent.date && !providedInfo.date) missing.push('date');
  if (!validatedEvent.location && !providedInfo.location) missing.push('location');
  if (!validatedEvent.estimatedPrice && !providedInfo.budget && !data.estimatedPrice) missing.push('budget');
  
  // Log validated event and missing fields for debugging
  console.log('Created validated event:', validatedEvent);
  console.log('Missing fields:', missing);
  
  return { validatedEvent, missing };
};

export const extractFieldsFromPrompt = (
  prompt: string, 
  data: any
): Record<string, string> => {
  const prePopulatedInfo: Record<string, string> = {};
  
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

  if ((dateTimeMatch || simpleDateMatch) && (data.missingFields?.includes('date') || !data.date)) {
    const dateStr = dateTimeMatch ? dateTimeMatch[1] : (simpleDateMatch ? simpleDateMatch[1] : "");
    // If year is missing, add the current year
    const currentYear = new Date().getFullYear();
    const dateWithYear = dateStr.includes(String(currentYear)) ? dateStr : `${dateStr}, ${currentYear}`;
    
    try {
      const date = new Date(dateWithYear);
      if (!isNaN(date.getTime())) {
        prePopulatedInfo.date = date.toISOString();
      } else {
        prePopulatedInfo.date = dateStr; // Use the string as-is if parsing fails
      }
    } catch (e) {
      prePopulatedInfo.date = dateStr;
    }
  }
  
  if (locationMatch && (data.missingFields?.includes('location') || !data.location)) {
    const locationField = data.missingFields?.includes('location') ? 'location' : 'city';
    prePopulatedInfo[locationField] = locationMatch[1].trim();
  }

  if (budgetMatch && (data.missingFields?.includes('budget') || !data.estimatedPrice)) {
    prePopulatedInfo.budget = `$${budgetMatch[1]}`;
  }

  return prePopulatedInfo;
};
