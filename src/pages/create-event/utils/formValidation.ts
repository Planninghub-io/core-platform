
import { EventFormData } from "../types";

export const validateRequiredFields = (formData: EventFormData): string[] => {
  const requiredFields = ['title'];
  
  // Add conditional required fields
  if (!formData.isFlexibleDate) {
    requiredFields.push('date', 'endDate');
  }
  
  if (!formData.isFlexibleLocation) {
    requiredFields.push('location');
  }
  
  // Budget is always required
  requiredFields.push('budget');
  
  return requiredFields.filter(field => !formData[field as keyof EventFormData]);
};
