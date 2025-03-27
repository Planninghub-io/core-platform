
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
  imageUrl?: string;
}

export const useEventCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<EventToCreate | null>(null);
  const [pendingAdditionalInfo, setPendingAdditionalInfo] = useState<Record<string, string> | null>(null);

  const createEvent = async (
    event: EventToCreate,
    additionalInfo: Record<string, string> = {}
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

    // Check authentication first
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      // Store event data to be created after authentication
      setPendingEventData(event);
      setPendingAdditionalInfo(additionalInfo);
      setShowSignUpDialog(true);
      return { error: new Error("Please sign in to create an event"), requiresAuth: true };
    }

    setIsCreating(true);
    try {
      // If we don't already have an image URL, generate one
      let finalImageUrl = event.imageUrl;
      
      if (!finalImageUrl && event.imagePrompt) {
        console.log('Generating image for event with prompt:', event.imagePrompt); // Debug log
        try {
          const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-event-image', {
            body: { prompt: event.imagePrompt },
          });

          if (imageError) {
            console.error('Error generating image:', imageError);
          } else if (imageData?.image_url) {
            finalImageUrl = imageData.image_url;
            console.log('Successfully generated image URL:', finalImageUrl);
          }
        } catch (imgError) {
          console.error('Exception generating image:', imgError);
        }
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
        budget: price,
        user_id: userData.user.id,
        status: 'upcoming',
        image_url: finalImageUrl
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
      
      setCreatedEventId(data.id);
      toast({
        description: "Event created successfully!",
      });
      
      // Navigate to the events hub page after successful creation
      navigate('/events-hub');
      
      return { data, error: null };

    } catch (error: any) {
      console.error('Error in createEvent:', error); // Debug log
      return { error };
    } finally {
      setIsCreating(false);
    }
  };

  const createPendingEventAfterAuth = async () => {
    if (pendingEventData && pendingAdditionalInfo) {
      return await createEvent(pendingEventData, pendingAdditionalInfo);
    }
    return { error: new Error("No pending event data") };
  };

  return {
    createEvent,
    createPendingEventAfterAuth,
    isCreating,
    createdEventId,
    showSignUpDialog,
    setShowSignUpDialog,
    pendingEventData
  };
};
