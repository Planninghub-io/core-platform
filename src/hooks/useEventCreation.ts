
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { safeCast } from '@/utils/supabaseHelpers';

export const useEventCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<any>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [location, setLocation] = useState('');

  const createEvent = async (eventData: any) => {
    setIsCreating(true);

    try {
      // Check auth
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        // Store for later and trigger sign up dialog
        setPendingEventData(eventData);
        setShowSignUpDialog(true);
        setIsCreating(false);
        return;
      }

      // Format data for database
      const formattedData = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        end_date: eventData.date, // Required field
        event_type: eventData.category || eventData.eventType,
        budget: parseFloat(eventData.estimatedPrice || eventData.budget) || null,
        image_url: eventData.imageUrl,
        user_id: data.user.id
      };

      console.log("Formatted event data:", formattedData);

      // Insert into database (using array syntax)
      const { data: createdEvent, error } = await supabase
        .from('events')
        .insert([formattedData])
        .select()
        .single();

      if (error) throw error;
      
      if (createdEvent && 'id' in createdEvent) {
        const eventId = String(createdEvent.id);
        setCreatedEventId(eventId);
        toast({
          description: 'Event created successfully!'
        });

        // Redirect to event page
        window.location.href = `/events/${eventId}`;
        return createdEvent;
      } else {
        throw new Error("Failed to get created event data");
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createEvent,
    isCreating,
    createdEventId,
    showSignUpDialog,
    setShowSignUpDialog,
    pendingEventData,
    setPendingEventData,
    eventTitle,
    setEventTitle,
    selectedDate,
    setSelectedDate,
    location,
    setLocation
  };
};
