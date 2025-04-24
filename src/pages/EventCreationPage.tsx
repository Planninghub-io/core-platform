
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EventForm } from './create-event/components/EventForm';
import { EventFormData } from './create-event/types';
import { useEventForm } from './create-event/hooks/useEventForm';
import { parseEventPrice } from '@/utils/priceUtils';
import { formatEventDate } from '@/utils/dateUtils';

const EventCreationPage = () => {
  const [searchParams] = useSearchParams();
  const {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleTimeChange,
    handleCheckboxChange,
    handleSubmit,
    isSubmitting
  } = useEventForm();

  useEffect(() => {
    // Try to get event data from URL
    const eventDataParam = searchParams.get('data');
    if (eventDataParam) {
      try {
        const eventData = JSON.parse(decodeURIComponent(eventDataParam));
        console.log("Received event data:", eventData);

        // Parse event data into form format
        const startDate = eventData.date ? new Date(eventData.date) : null;
        const parsedBudget = parseEventPrice(eventData.estimatedPrice);

        setFormData(prev => ({
          ...prev,
          title: eventData.title || '',
          description: eventData.description || '',
          date: startDate?.toISOString() || '',
          endDate: startDate?.toISOString() || '',
          location: eventData.location || '',
          eventType: eventData.category || '',
          budget: parsedBudget?.toString() || '',
          budgetCurrency: 'USD',
          timezone: 'UTC',
          startTime: '09:00',
          endTime: '17:00',
        }));
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    }
  }, [searchParams, setFormData]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <div className="p-6 rounded-lg bg-white shadow-sm">
        <EventForm
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          handleCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
};

export default EventCreationPage;
