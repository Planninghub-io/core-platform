
// Validation utilities
import type { EventData } from '../types.ts';

/**
 * Check which fields are missing in the event data
 */
export function checkMissingFields(eventData: Partial<EventData>): string[] {
  const missingFields = [];
  
  if (!eventData.date) {
    missingFields.push('date');
  }
  
  if (!eventData.location) {
    missingFields.push('location');
  }
  
  return missingFields;
}
