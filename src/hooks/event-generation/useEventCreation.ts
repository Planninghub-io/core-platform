
import { useState } from "react";
import { GeneratedEvent } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { extractNumericValue } from "@/utils/priceUtils";

/**
 * Hook for event creation handler
 */
export const useEventCreationHandler = (
  generatedEvent: GeneratedEvent | null,
  eventTitle: string,
  hasMissingDate: boolean,
  selectedDate: string,
  hasMissingLocation: boolean,
  location: string,
  additionalInfo: Record<string, string>,
  createEvent: (eventData: any) => Promise<{ eventId: string | null }>
) => {
  const handleCreateEvent = async () => {
    if (!generatedEvent) {
      console.error("No generated event available");
      return;
    }
    
    console.log("useEventCreationHandler: Creating event");
    
    // Use the eventTitle if provided, otherwise use the generated title
    const finalTitle = eventTitle || generatedEvent.title;
    
    // Use the provided date/location if available, otherwise use generated ones
    const eventToCreate = {
      ...generatedEvent,
      title: finalTitle,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    };
    
    console.log("Event data to create:", eventToCreate);
    
    try {
      const result = await createEvent(eventToCreate);
      console.log("Create event result:", result);
      return result;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };
  
  return { handleCreateEvent };
};

/**
 * Hook for creating events in the database
 */
export const useEventCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createEvent = async (
    event: GeneratedEvent, 
    eventTitle: string = "",
    selectedDate?: string
  ) => {
    console.log("useEventCreation: Creating event:", { 
      title: eventTitle || event.title,
      date: selectedDate || event.date
    });
    
    setIsCreating(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Parse budget from string to numeric value for database storage
      let budgetValue = null;
      if (event.estimatedPrice) {
        budgetValue = extractNumericValue(event.estimatedPrice);
      }

      // Create event data object with required user_id field
      const eventData = {
        title: eventTitle || event.title,
        description: event.description,
        date: selectedDate || event.date,
        // Set end date to 3 hours after start by default
        end_date: new Date(new Date(selectedDate || event.date).getTime() + 3 * 60 * 60 * 1000).toISOString(),
        location: event.location,
        category: event.category,
        image_url: event.imageUrl,
        // Store numeric budget value
        budget: budgetValue,
        // Add the required user_id field
        user_id: userData.user.id
      };

      console.log("Event data for DB insert:", eventData);

      // Create the event in Supabase - using array syntax for insert
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
      
      if (error) {
        console.error("Database error on event insert:", error);
        throw error;
      }
      
      console.log("Event created successfully:", data);
      
      toast({
        description: "Event created successfully!",
      });
      
      // Navigate to the events hub page
      navigate(`/events-hub`);
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createEvent
  };
};
