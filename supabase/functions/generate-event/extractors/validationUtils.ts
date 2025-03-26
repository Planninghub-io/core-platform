
// Validation utilities
import type { EventData } from '../types.ts';

/**
 * Check which fields are missing in the event data
 */
export function checkMissingFields(eventData: Partial<EventData>): string[] {
  const missingFields = [];
  
  // Check for critical fields that must be present
  if (!eventData.date) {
    missingFields.push('date');
  }
  
  if (!eventData.location) {
    missingFields.push('location');
  }
  
  if (!eventData.estimatedPrice) {
    missingFields.push('budget');
  }
  
  if (!eventData.attendees) {
    missingFields.push('attendees');
  }
  
  return missingFields;
}

/**
 * Validate that an event has all required fields
 */
export function validateEventData(eventData: Partial<EventData>): boolean {
  return checkMissingFields(eventData).length === 0;
}
