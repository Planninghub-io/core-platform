
import { EventFormData } from "../types";

export const validateRequiredFields = (formData: EventFormData): string[] => {
  const requiredFields = ['title', 'date', 'endDate', 'location'];
  return requiredFields.filter(field => !formData[field as keyof EventFormData]);
};
