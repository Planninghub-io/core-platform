
import { EventFormData } from "../types";

/**
 * Validates required fields in the event form
 * @param formData Event form data
 * @returns Array of field names that are required but empty
 */
export const validateRequiredFields = (formData: EventFormData): string[] => {
  const requiredFields: Array<{name: keyof EventFormData, label: string}> = [
    { name: 'title', label: 'Event Name' },
    { name: 'budget', label: 'Budget' }
  ];
  
  // Add location as required only if flexible location is not checked
  if (!formData.isFlexibleLocation) {
    requiredFields.push({ name: 'location', label: 'Location' });
  }
  
  // Check which required fields are empty
  return requiredFields
    .filter(field => {
      const value = formData[field.name];
      return value === undefined || value === null || value === '';
    })
    .map(field => field.label);
};
