
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
    if (!generatedEvent) return;
    
    // Use the eventTitle if provided, otherwise use the generated title
    const finalTitle = eventTitle || generatedEvent.title;
    
    // Use the provided date/location if available, otherwise use generated ones
    const eventToCreate = {
      ...generatedEvent,
      title: finalTitle,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    };
    
    await createEvent(eventToCreate);
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
    setIsCreating(true);
    
    try {
      // Parse budget from string to numeric value for database storage
      let budgetValue = null;
      if (event.estimatedPrice) {
        budgetValue = extractNumericValue(event.estimatedPrice);
      }

      // Create event data object (not in array)
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
        // We should not use estimated_budget directly as it's not in the schema
        // Instead, save the information we need and use it for display
      };

      // Create the event in Supabase
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        description: "Event created successfully!",
      });
      
      // Navigate to the new event page
      navigate(`/event/${data.id}`);
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
