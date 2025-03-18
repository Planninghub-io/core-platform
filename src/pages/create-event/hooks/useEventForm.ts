
import { useState, useEffect } from "react";
import { EventFormData } from "../types";
import { useEventSubmission } from "./useEventSubmission";

export const useEventForm = () => {
  const { handleSubmit: submitEvent, isSubmitting } = useEventSubmission();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    timezone: "UTC",
    location: "",
    preferredLocations: "",
    budget: "",
    budgetCurrency: "USD",
    attendees: "",
    eventType: "",
    venueType: "",
    imageUrl: "",
    isFlexibleDate: false,
    isFlexibleLocation: false,
  });

  // Set default end date when start date changes
  useEffect(() => {
    if (formData.date && !formData.endDate) {
      // Handle ISO date string
      if (typeof formData.date === 'string' && formData.date.includes('T')) {
        // Extract just the date part if it's an ISO string
        const startDate = new Date(formData.date);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);
        setFormData(prev => ({
          ...prev,
          endDate: endDate.toISOString().slice(0, 16)
        }));
      } else {
        // Handle regular date object
        const startDate = new Date(formData.date);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);
        setFormData(prev => ({
          ...prev,
          endDate: endDate.toISOString().slice(0, 16)
        }));
      }
    }
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (field: string, value: Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEvent(formData, e);
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
