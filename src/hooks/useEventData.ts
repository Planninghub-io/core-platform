
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import debounce from "lodash/debounce";
import { ensureUUID, safeCast } from "@/utils/supabaseHelpers";

interface Event {
  id: string;
  title: string;
  date: string;
  end_date: string;
  description: string | null;
  location: string | null;
  category: string | null;
  expected_attendees: number | null;
  image_url: string | null;
  status?: string;
  budget?: number | string | null;
  user_profiles?: {
    email: string | null;
  } | null;
}

export const useEventData = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch event details when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching event details for ID:', eventId);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          user_profiles (
            email
          )
        `)
        .eq('id', ensureUUID(eventId))
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        throw error;
      }
      
      if (data) {
        console.log('Event data retrieved:', data);
        // Use explicit type casting to safely handle the response
        setEvent(safeCast<Event>(data));
      } else {
        console.warn('No event found with ID:', eventId);
        setEvent(null);
      }
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // This version just updates local state without saving to DB
  const handleInputChange = (field: string, value: string | number) => {
    setEvent(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  // Non-debounced version for immediate saves
  const saveChanges = async (updates: Record<string, any>) => {
    if (!eventId || !event) {
      toast({
        title: "Error",
        description: "No event to update",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', ensureUUID(eventId));

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Debounced version for auto-save during typing
  const debouncedSave = debounce(async (updates: Record<string, any>) => {
    if (!eventId) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', ensureUUID(eventId));

      if (error) throw error;
    } catch (error: any) {
      console.error('Error auto-saving changes:', error);
    }
  }, 1000);

  const handleDelete = async () => {
    if (!eventId) return false;
    
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', ensureUUID(eventId));

      if (error) throw error;

      toast({
        description: "Event deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    event,
    loading,
    handleInputChange,
    saveChanges,
    debouncedSave,
    handleDelete
  };
};
