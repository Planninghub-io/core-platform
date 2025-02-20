
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { User } from "@supabase/supabase-js";

const EventsHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [searchQuery, dateRange, user]);

  const fetchEvents = async () => {
    try {
      // Update event statuses before fetching
      await supabase.rpc('update_event_status');
      
      let query = supabase
        .from('events')
        .select(`
          *,
          profiles:user_id (
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

  // If no user is logged in, redirect to auth page
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getEventsByStatus = (status: string) => {
    return events.filter(event => event.status === status);
  };

  const renderEventSection = (title: string, status: string, showFilters: boolean = false) => {
    const filteredEvents = getEventsByStatus(status);
    
    if (filteredEvents.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {showFilters && <EventFilters onDateRangeChange={setDateRange} />}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={new Date(event.date).toLocaleDateString()}
              endDate={new Date(event.end_date).toLocaleDateString()}
              location={event.location}
              imageUrl={event.image_url}
              category={event.category}
              createdBy={event.profiles?.email || 'Unknown'}
              expectedAttendees={event.expected_attendees}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events Hub</h1>
        <Button onClick={() => navigate("/create-event")} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="space-y-12">
        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : events.length > 0 ? (
          <>
            {renderEventSection("In Progress", "in_progress")}
            {renderEventSection("Upcoming", "upcoming")}
            {renderEventSection("Completed", "completed", true)}
          </>
        ) : (
          <div className="text-center text-gray-500">No events found</div>
        )}
      </div>
    </div>
  );
};

export default EventsHub;

