
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedEvent } from "../types";

export const useEventCreationHandler = () => {
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  // Handle create event
  const handleCreateEvent = async (generatedEvent: GeneratedEvent | null) => {
    if (!generatedEvent) {
      toast({
        title: "Error",
        description: "Please generate an event first.",
        variant: "destructive",
      });
      return;
    }

    if (!eventTitle) {
      toast({
        title: "Error",
        description: "Please enter an event title.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      // Store event data for later creation
      return setShowSignUpDialog(true);
    }

    // Create event object
    const eventData = {
      title: eventTitle,
      description: generatedEvent.description,
      date: selectedDate || generatedEvent.date,
      end_date: selectedDate || generatedEvent.date, // Required field for DB
      location: location || generatedEvent.location,
      budget: parseFloat(generatedEvent.estimatedPrice) || null, // Convert to number or use null
      event_type: generatedEvent.category,
      image_url: generatedEvent.imageUrl,
      user_id: userData.user.id
    };

    // Create event in database
    try {
      // Insert the new event into the database
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Show success message
      toast({
        description: "Event created successfully!",
      });

      // Redirect to event page
      window.location.href = `/event/${data.id}`;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
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
    handleCreateEvent
  };
};
