
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EventFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { combineDateTime } from "../utils/dateTimeUtils";
import { useInvitationCreation } from "./useInvitationCreation";
import { validateRequiredFields } from "../utils/formValidation";

export const useEventSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createDefaultInvitation } = useInvitationCreation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: EventFormData, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = validateRequiredFields(formData);

    if (requiredFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${requiredFields.join(', ')}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        toast({
          title: "Error",
          description: "Please sign in to create an event",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Combine date and time
      const startDateTime = combineDateTime(formData.date, formData.startTime);
      const endDateTime = combineDateTime(formData.endDate, formData.endTime);

      // Parse preferred locations if flexible
      let preferredLocationsArray = null;
      if (formData.isFlexibleLocation && formData.preferredLocations) {
        preferredLocationsArray = formData.preferredLocations
          .split(',')
          .map(loc => loc.trim())
          .filter(loc => loc); // Filter out empty strings
      }

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: startDateTime,
            end_date: endDateTime,
            location: formData.isFlexibleLocation ? null : formData.location,
            budget: parseFloat(formData.budget) || null,
            budget_currency: formData.budgetCurrency,
            image_url: formData.imageUrl,
            expected_attendees: formData.attendees ? parseInt(formData.attendees) : null,
            user_id: userData.user.id,
            is_flexible_date: formData.isFlexibleDate,
            is_flexible_location: formData.isFlexibleLocation,
            preferred_locations: preferredLocationsArray,
            event_type: formData.eventType,
            venue_type: formData.venueType,
            timezone: formData.timezone
          }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Create a default invitation for this event
        await createDefaultInvitation(
          data[0].id,
          formData.title,
          formData.description,
          startDateTime,
          formData.location,
          formData.budget,
          formData.budgetCurrency
        );
      }

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      
      navigate("/events-hub");
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
