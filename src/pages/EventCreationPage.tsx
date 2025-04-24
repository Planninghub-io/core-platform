
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EventForm } from './create-event/components/EventForm';
import { EventFormData } from './create-event/types';
import { useEventForm } from './create-event/hooks/useEventForm';
import { parseEventPrice } from '@/utils/priceUtils';
import { toast } from 'sonner';

const EventCreationPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoadingData, setIsLoadingData] = useState(true);
  
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
        console.log("Received event data from URL:", eventData);

        // Parse date - handle both ISO string and date string formats
        let startDate = null;
        if (eventData.date) {
          try {
            // Try to parse as ISO date first
            startDate = new Date(eventData.date);
            
            // Check if valid date
            if (isNaN(startDate.getTime())) {
              // Try different format if needed
              const dateRegex = /(\d{4}-\d{2}-\d{2})/;
              const match = eventData.date.match(dateRegex);
              if (match) {
                startDate = new Date(match[1]);
              }
            }
          } catch (error) {
            console.error("Error parsing date:", error);
            // Fallback to current date if parsing fails
            startDate = new Date();
          }
        }

        // Parse budget
        let parsedBudget = '';
        if (eventData.estimatedPrice) {
          const budget = parseEventPrice(eventData.estimatedPrice);
          parsedBudget = budget ? budget.toString() : '';
        }

        // Create default end date (2 hours after start)
        const endDate = startDate ? new Date(startDate.getTime() + (2 * 60 * 60 * 1000)) : null;

        // Format times
        const startTime = startDate ? 
          `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}` : 
          '09:00';
        
        const endTime = endDate ? 
          `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}` : 
          '17:00';

        // Populate form data
        setFormData(prev => ({
          ...prev,
          title: eventData.title || '',
          description: eventData.description || '',
          date: startDate?.toISOString() || '',
          endDate: endDate?.toISOString() || '',
          location: eventData.location || '',
          eventType: eventData.category || '',
          budget: parsedBudget,
          budgetCurrency: 'USD',
          timezone: 'UTC',
          startTime: startTime,
          endTime: endTime,
          imageUrl: eventData.imageUrl || '',
        }));

        toast.success("Event details have been loaded from your chat");
      } catch (error) {
        console.error("Error parsing event data from URL:", error);
        toast.error("Could not load event details");
      } finally {
        setIsLoadingData(false);
      }
    } else {
      setIsLoadingData(false);
    }
  }, [searchParams, setFormData]);

  if (isLoadingData) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-center">
          <div className="text-lg mb-2">Loading event data...</div>
          <div className="h-2 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>
      </div>
    );
  }

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
