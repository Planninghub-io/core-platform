
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventFormData } from "../types";
import { validateRequiredFields } from "../utils/formValidation";

export const useEventForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    if (formData.date) {
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
                ${formData.price ? `<p><strong>Price:</strong> $${formData.price}</p>` : ''}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = validateRequiredFields(formData);

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

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: new Date(formData.date).toISOString(),
            end_date: new Date(formData.endDate).toISOString(),
            location: formData.location,
            price: parseFloat(formData.price) || null,
            image_url: formData.imageUrl,
            category: formData.category,
            user_id: userData.user.id,
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
    handleChange,
    handleSubmit,
  };
};
