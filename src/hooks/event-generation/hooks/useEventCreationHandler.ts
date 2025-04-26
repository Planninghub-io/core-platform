
import { useState } from "react";
import { useEventCreation } from "@/hooks/useEventCreation";
import { GeneratedEvent } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useEventCreationHandler = () => {
  const navigate = useNavigate();
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");
  const { createEvent, isCreating } = useEventCreation();

  const handleCreateEvent = async (generatedEvent: GeneratedEvent | null) => {
    if (!generatedEvent) {
      toast.error("No event data available");
      return;
    }

    console.log("Creating event with data:", {
      title: eventTitle || generatedEvent.title,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    });

    if (!eventTitle && !generatedEvent.title) {
      toast.error("Please add a title for your event");
      return;
    }

    // Check authentication
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setShowSignUpDialog(true);
      return;
    }

    const finalTitle = eventTitle || generatedEvent.title || "";
    if (!finalTitle.trim()) {
      toast.error("Event title cannot be empty");
      return;
    }

    // Create event object
    const eventData = {
      title: finalTitle,
      description: generatedEvent.description || "",
      date: selectedDate || generatedEvent.date || "",
      location: location || generatedEvent.location || "",
      category: generatedEvent.category || "Other",
      estimatedPrice: generatedEvent.estimatedPrice || "Free",
      imagePrompt: `Event graphic for ${finalTitle}, professional looking, high quality`,
      imageUrl: generatedEvent.imageUrl
    };

    // Create the event in the database
    const result = await createEvent(eventData);
    
    // Fixed: Remove the .error property check and handle the result directly
    if (result) {
      toast.success("Event created successfully!");
      // Navigate to events hub after successful creation
      navigate("/events-hub");
    }
  };

  return {
    showSignUpDialog,
    setShowSignUpDialog,
    eventTitle,
    setEventTitle,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    isCreating,
    handleCreateEvent
  };
};
