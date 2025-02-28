
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { parseEventPrice } from "@/utils/priceUtils";
import { formatEventDate } from "@/utils/dateUtils";

export interface EventToCreate {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

export const useEventCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const createDefaultInvitation = async (eventId: string, eventTitle: string, eventDescription: string, eventDate: string, eventLocation: string, eventPrice: number | null) => {
    try {
      // First, create a default template
      const { data: templateData, error: templateError } = await supabase
        .from('invitation_templates')
        .insert({
          name: `${eventTitle} Invitation`,
          description: 'Default template for your event',
          event_type: 'default',
          template_html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <h1 style="color: #333;">${eventTitle}</h1>
              <p style="color: #666;">${eventDescription || 'Join us for this special event!'}</p>
              <div style="margin: 20px 0;">
                <p><strong>Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
                <p><strong>Location:</strong> ${eventLocation || 'TBD'}</p>
                ${eventPrice ? `<p><strong>Price:</strong> $${eventPrice}</p>` : ''}
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

  const createEvent = async (
    event: EventToCreate,
    additionalInfo: Record<string, string>
  ) => {
    console.log('Creating event with data:', event); // Debug log

    if (!event.title) {
      console.error('Title is missing from event data'); // Debug log
      return { error: new Error("Event title is required") };
    }

    const trimmedTitle = event.title.trim();
    if (trimmedTitle === '') {
      console.error('Title is empty after trimming'); // Debug log
      return { error: new Error("Event title cannot be empty") };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: new Error("User not authenticated") };
    }

    setIsCreating(true);
    try {
      console.log('Generating image for event...'); // Debug log
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-event-image', {
        body: { prompt: event.imagePrompt },
      });

      if (imageError) {
        console.error('Error generating image:', imageError);
      }

      const price = parseEventPrice(event.estimatedPrice);
      const { startDate, endDate } = formatEventDate(event.date, additionalInfo);

      const eventData = {
        title: trimmedTitle,
        description: event.description || '',
        date: startDate,
        end_date: endDate,
        location: event.location || '',
        category: event.category || '',
        price,
        user_id: userData.user.id,
        status: 'upcoming',
        image_url: imageData?.image_url || null
      };

      console.log('Inserting event with data:', eventData); // Debug log

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error); // Debug log
        throw error;
      }

      console.log('Event created successfully:', data); // Debug log
      
      // Create a default invitation
      await createDefaultInvitation(
        data.id, 
        data.title, 
        data.description, 
        data.date, 
        data.location, 
        data.price
      );
      
      setCreatedEventId(data.id);
      return { data, error: null };

    } catch (error: any) {
      console.error('Error in createEvent:', error); // Debug log
      return { error };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createEvent,
    isCreating,
    createdEventId
  };
};
