
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

  const createEvent = async (
    event: EventToCreate,
    additionalInfo: Record<string, string>
  ) => {
    if (!event.title || event.title.trim() === '') {
      return { error: new Error("Event title is required") };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: new Error("User not authenticated") };
    }

    setIsCreating(true);
    try {
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-event-image', {
        body: { prompt: event.imagePrompt },
      });

      if (imageError) {
        console.error('Error generating image:', imageError);
      }

      const price = parseEventPrice(event.estimatedPrice);
      const { startDate, endDate } = formatEventDate(event.date, additionalInfo);

      const { data, error } = await supabase.from('events').insert({
        title: event.title.trim(),
        description: event.description,
        date: startDate,
        end_date: endDate,
        location: event.location,
        category: event.category,
        price,
        user_id: userData.user.id,
        status: 'upcoming',
        image_url: imageData?.image_url || null
      }).select().single();

      if (error) throw error;

      setCreatedEventId(data.id);
      return { data, error: null };

    } catch (error: any) {
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
