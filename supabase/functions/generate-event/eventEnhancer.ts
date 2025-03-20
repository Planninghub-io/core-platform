
// Event enhancement utilities
import { normalizeDate } from './dateUtils.ts';
import { processLocation } from './locationUtils.ts';
import { improveEventTitle, improveTitleForMonthNames } from './titleUtils.ts';
import { improveDescription, generateImagePrompt } from './descriptionUtils.ts';
import type { EventData } from './types.ts';

/**
 * Enhance extracted event data with improved fields
 */
export function enhanceEventData(
  extractedEvent: Partial<EventData>, 
  fullPrompt: string
): Partial<EventData> {
  const enhancedEvent = { ...extractedEvent };
  
  // Normalize date format if present
  if (enhancedEvent.date) {
    enhancedEvent.date = normalizeDate(enhancedEvent.date);
  }
  
  // Process location data
  if (enhancedEvent.location) {
    enhancedEvent.location = processLocation(enhancedEvent.location, fullPrompt);
  }
  
  // Improve title
  if (enhancedEvent.title) {
    enhancedEvent.title = improveEventTitle(enhancedEvent.title, fullPrompt, enhancedEvent.location || '');
    // Handle month-name titles
    enhancedEvent.title = improveTitleForMonthNames(enhancedEvent.title, fullPrompt, enhancedEvent.location || '');
  }
  
  // Improve description
  enhancedEvent.description = improveDescription(
    enhancedEvent.description, 
    enhancedEvent.title || '', 
    enhancedEvent.location || '', 
    enhancedEvent.category || 'Other'
  );
  
  // Create image prompt
  enhancedEvent.imagePrompt = generateImagePrompt(enhancedEvent.title || '', enhancedEvent.location || '');
  
  return enhancedEvent;
}

/**
 * Combine AI-generated event data with extracted data
 */
export function combineEventData(
  aiGeneratedEvent: Partial<EventData>,
  extractedEvent: Partial<EventData>
): Partial<EventData> {
  return {
    ...aiGeneratedEvent,
    title: aiGeneratedEvent.title || extractedEvent.title || "",
    description: aiGeneratedEvent.description || extractedEvent.description || "",
    location: aiGeneratedEvent.location || extractedEvent.location || "",
    date: aiGeneratedEvent.date || extractedEvent.date || "",
    category: aiGeneratedEvent.category || extractedEvent.category || "Other",
    estimatedPrice: aiGeneratedEvent.estimatedPrice || extractedEvent.estimatedPrice || "Free",
    imagePrompt: aiGeneratedEvent.imagePrompt || 
                `An event "${aiGeneratedEvent.title || extractedEvent.title}" at ${aiGeneratedEvent.location || extractedEvent.location}`,
  };
}

/**
 * Check if we have enough information to generate an event
 */
export function hasMinimumEventInfo(
  extractedEvent: Partial<EventData>, 
  additionalInfo: any
): boolean {
  return !!(
    extractedEvent.title || 
    extractedEvent.location || 
    (additionalInfo && additionalInfo.date) || 
    (additionalInfo && additionalInfo.location) ||
    (additionalInfo && additionalInfo.budget)
  );
}
