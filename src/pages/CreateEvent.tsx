
import { useNavigate, useLocation } from "react-router-dom";
import { EventForm } from "./create-event/components/EventForm";
import { useEventForm } from "./create-event/hooks/useEventForm";
import { useEffect } from "react";
import { EventFormData } from "./create-event/types";

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    formData, 
    setFormData, 
    handleChange, 
    handleSelectChange,
    handleDateChange,
    handleTimeChange, 
    handleCheckboxChange,
    handleSubmit 
  } = useEventForm();
  
  // Check if we have event data from the authentication flow
  useEffect(() => {
    if (location.state?.eventData) {
      const eventData = location.state.eventData;
      
      // Map the AI generated event data to the form structure
      const mappedData: Partial<EventFormData> = {
        title: eventData.title || '',
        description: eventData.description || '',
        date: eventData.date || '',
        location: eventData.location || '',
        eventType: eventData.category || '',
        budget: eventData.estimatedPrice || '',
        imageUrl: '', // Will be generated
      };
      
      // Pre-fill the form with this data
      setFormData(prev => ({
        ...prev,
        ...mappedData
      }));
    }
  }, [location.state, setFormData]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="mb-8 text-gray-600">Please input your event details</p>
        <EventForm
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          handleCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
