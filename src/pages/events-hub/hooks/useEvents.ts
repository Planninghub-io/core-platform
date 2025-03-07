
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface EventWithProfile {
  id: string;
  title: string;
  date: string;
  end_date: string;
  location: string | null;
  image_url: string | null;
  category: string | null;
  expected_attendees: number | null;
  status: string | null;
  user_profiles: {
    email: string | null;
  } | null;
}

export const useEvents = (user: any) => {
  const [events, setEvents] = useState<EventWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const { toast } = useToast();

  useEffect(() => {
    console.log("EventsHub: Fetch events effect running", { user: !!user, query: searchQuery });
    if (user) {
      fetchEvents();
    }
  }, [searchQuery, dateRange, user]);

  const fetchEvents = async () => {
    console.log("EventsHub: Fetching events");
    try {
      // Update event statuses before fetching
      await supabase.rpc('update_event_status');
      
      let query = supabase
        .from('events')
        .select(`
          *,
          user_profiles (
            email
          )
        `)
        .order('date', { ascending: true });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (dateRange.from) {
        query = query.gte('date', dateRange.from.toISOString());
      }

      if (dateRange.to) {
        query = query.lte('date', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        throw new Error("Failed to fetch events. Please try again.");
      }

      console.log("EventsHub: Fetched events", data?.length || 0);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    events,
    loading,
    searchQuery,
    dateRange,
    setDateRange,
    handleSearch
  };
};
