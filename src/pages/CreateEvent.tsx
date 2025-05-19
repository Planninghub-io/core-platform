
import { useNavigate, useLocation } from "react-router-dom";
import { EventForm } from "./create-event/components/EventForm";
import { useEventForm } from "./create-event/hooks/useEventForm";
import { useEffect, useState } from "react";
import { EventFormData } from "./create-event/types";
import { SignUpDialog } from "@/components/EventGenerator/SignUpDialog";
import { useEventCreation } from "@/hooks/useEventCreation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    formData, 
    setFormData, 
    handleChange, 
    handleSelectChange,
    handleDateChange,
    handleTimeChange, 
    handleCheckboxChange,
    handleSubmit: originalHandleSubmit 
  } = useEventForm();
  
  const { 
    showSignUpDialog, 
    setShowSignUpDialog, 
    pendingEventData,
    setPendingEventData
  } = useEventCreation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Error checking auth status:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Check if we have event data from the URL
  useEffect(() => {
    const eventDataParam = new URLSearchParams(location.search).get('data');
    
    if (eventDataParam) {
      try {
        const eventData = JSON.parse(decodeURIComponent(eventDataParam));
        console.log("CreateEvent: Found event data in URL:", eventData);
        
        // Store the pending event data in case the user needs to sign up
        setPendingEventData(eventData);
        
        // Map the AI generated event data to the form structure
        const mappedData: Partial<EventFormData> = {
          title: eventData.title || '',
          description: eventData.description || '',
          date: eventData.date || '',
          location: eventData.location || '',
          eventType: eventData.category || '',
          budget: eventData.estimatedPrice || '',
          imageUrl: eventData.imageUrl || '', 
        };
        
        // Pre-fill the form with this data
        setFormData(prev => ({
          ...prev,
          ...mappedData
        }));
        
        // Show toast notification
        toast({
          title: "Event data loaded",
          description: "Your event details have been loaded from the AI assistant.",
        });
      } catch (error) {
        console.error("Error parsing event data from URL:", error);
        toast({
          title: "Error",
          description: "Could not load event details from URL.",
          variant: "destructive",
        });
      }
    }
  }, [location.search, setFormData, toast, setPendingEventData]);

  // Custom submit handler that checks authentication
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated before submitting
    if (!user) {
      setPendingEventData(formData);
      setShowSignUpDialog(true);
      return;
    }
    
    // Proceed with normal submission
    originalHandleSubmit(formData);
  };

  const handleSignUpIndividual = () => {
    // Navigate to auth page with event data to create after sign up
    navigate('/auth', { 
      state: { 
        eventData: pendingEventData,
        redirectPath: '/create-event'
      } 
    });
    setShowSignUpDialog(false);
  };

  const handleSignUpBusiness = () => {
    // Navigate to business auth page with event data to create after sign up
    navigate('/auth', { 
      state: { 
        eventData: pendingEventData,
        redirectPath: '/create-event',
        type: 'business'
      } 
    });
    setShowSignUpDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

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
          handleSubmit={handleFormSubmit}
          handleCancel={() => navigate("/")}
        />

        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          onSignUpIndividual={handleSignUpIndividual}
          onSignUpBusiness={handleSignUpBusiness}
          eventData={pendingEventData}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
