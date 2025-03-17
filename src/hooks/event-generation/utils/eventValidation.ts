
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
    estimatedPrice: data.estimatedPrice || 'Free',
    imagePrompt: data.imagePrompt || 'event',
  };

  // Check for missing critical fields, but respect provided info
  const missing: string[] = [];
  if (!validatedEvent.date && !providedInfo.date) missing.push('date');
  if (!validatedEvent.location && !providedInfo.location) missing.push('location');
  
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
  
  const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
  const dateTimeMatch = prompt.match(dateTimeRegex);
  
  const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
  const locationMatch = prompt.match(locationRegex);

  if (dateTimeMatch && data.missingFields?.includes('date')) {
    prePopulatedInfo.date = dateTimeMatch[1];
  }
  
  if (locationMatch && (data.missingFields?.includes('location') || data.missingFields?.includes('city'))) {
    const locationField = data.missingFields?.includes('location') ? 'location' : 'city';
    prePopulatedInfo[locationField] = locationMatch[1];
  }

  return prePopulatedInfo;
};
