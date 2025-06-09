
import { useState } from "react";
import { EventFormData } from "../types";
import { useEventSubmission } from "./useEventSubmission";
import { getTimezoneFromLocation } from "../utils/timezoneUtils";

export const useEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    timezone: "America/New_York",
    location: "",
    preferredLocations: "",
    budget: "",
    budgetCurrency: "USD",
    attendees: "",
    eventType: "",
    venueType: "",
    imageUrl: "",
    isFlexibleDate: false,
    isFlexibleLocation: false
  });

  const { handleSubmit: submitEvent, isSubmitting } = useEventSubmission();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update timezone when location changes
      if (name === 'location' && value && !newData.isFlexibleLocation) {
        const detectedTimezone = getTimezoneFromLocation(value);
        newData.timezone = detectedTimezone;
      }
      
      return newData;
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, value: Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  // Updated: handleSubmit now accepts the form data directly instead of an event
  const handleSubmit = (formData: EventFormData) => {
    return submitEvent(formData);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleTimeChange,
    handleCheckboxChange,
    handleSubmit,
    isSubmitting
  };
};
