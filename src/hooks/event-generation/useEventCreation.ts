
import { useState } from "react";
import { GeneratedEvent } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { extractNumericValue } from "@/utils/priceUtils";

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

      // Create the event in Supabase
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: eventTitle || event.title,
            description: event.description,
            date: selectedDate || event.date,
            // Set end date to 3 hours after start by default
            end_date: new Date(new Date(selectedDate || event.date).getTime() + 3 * 60 * 60 * 1000).toISOString(),
            location: event.location,
            category: event.category,
            image_url: event.imageUrl,
            estimated_budget: event.estimatedPrice, // Save the formatted string for display
            budget: budgetValue, // Save the numeric value for calculations
          }
        ])
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
