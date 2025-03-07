
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventFormData } from "../types";
import { validateRequiredFields } from "../utils/formValidation";
import { format, set } from "date-fns";

export const useEventForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    timezone: "UTC",
    location: "",
    preferredLocations: "",
    budget: "",
    budgetCurrency: "USD",
    attendees: "",
    eventType: "",
    venueType: "",
    imageUrl: "",
    isFlexibleDate: false,
    isFlexibleLocation: false,
  });

  useEffect(() => {
    if (formData.date && !formData.endDate) {
      const startDate = new Date(formData.date);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (field: string, value: Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const createDefaultInvitation = async (eventId: string) => {
    try {
      // First, create a default template
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${formData.title} Invitation`,
          description: 'Default template for your event',
          event_type: 'default',
          template_html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <h1 style="color: #333;">${formData.title}</h1>
              <p style="color: #666;">${formData.description || 'Join us for this special event!'}</p>
              <div style="margin: 20px 0;">
                <p><strong>Date:</strong> ${new Date(formData.date).toLocaleString()}</p>
                <p><strong>Location:</strong> ${formData.location || 'TBD'}</p>
                ${formData.budget ? `<p><strong>Budget:</strong> ${formData.budgetCurrency} ${formData.budget}</p>` : ''}
              </div>
              <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">RSVP Now</a>
              </div>
            </div>
          `
        })
        .select()
        .single();

      if (templateError) {
        console.error('Error creating template:', templateError);
        return;
      }

      // Then create an invitation with this template
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          event_id: eventId,
          template_id: templateData.id,
          status: 'draft'
        });

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
      }
    } catch (error) {
      console.error('Error in createDefaultInvitation:', error);
    }
  };

  const combineDateTime = (dateValue: Date | string, timeValue: string): string => {
    if (!dateValue) return '';
    
    const date = new Date(dateValue);
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['title'];
    if (!formData.isFlexibleDate) {
      requiredFields.push('date', 'endDate');
    }
    if (!formData.isFlexibleLocation) {
      requiredFields.push('location');
    }
    requiredFields.push('budget');

    const missingFields = requiredFields.filter(field => !formData[field as keyof EventFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
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
        await createDefaultInvitation(data[0].id);
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
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleTimeChange,
    handleCheckboxChange,
    handleSubmit,
  };
};
