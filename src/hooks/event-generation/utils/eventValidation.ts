
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
