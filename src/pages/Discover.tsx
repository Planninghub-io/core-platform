
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import FeaturedEvent from "@/components/FeaturedEvent";
import EventFilters from "@/components/EventFilters";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

const Discover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const featuredEvent = {
    title: "Coachella Valley Music and Arts Festival",
    description: "Experience the world's most iconic music festival featuring top artists, incredible art installations, and unforgettable moments.",
    date: "April 12-21, 2024",
    location: "Indio, California",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    price: "$499",
  };

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
    fetchEvents();
  }, [searchQuery, dateRange]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(showMore ? 100 : 8);

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

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-primary pb-20 pt-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')] bg-cover bg-center bg-no-repeat opacity-10" />
        <div className="container relative z-10">
          <div className="flex justify-end mb-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white">Welcome, {user.email}</span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
          <div className="mb-12 text-center">
            <h1 className="animate-fade-down mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Discover Amazing Events
            </h1>
            <p className="animate-fade-up mx-auto mb-8 max-w-2xl text-lg text-white/90">
              Find and book tickets for the best concerts, sports events, and shows happening near you.
            </p>
            <div className="flex flex-col items-center gap-4">
              <SearchBar onSearch={handleSearch} />
              <button
                onClick={() => navigate("/create-event")}
                className="animate-fade-up rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-white/90"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Filters</h2>
          </div>
          <EventFilters onDateRangeChange={setDateRange} />
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Featured Event</h2>
          <FeaturedEvent {...featuredEvent} />
        </div>

        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Upcoming Events</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading events...</div>
          ) : events.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString()}
                    location={event.location}
                    imageUrl={event.image_url}
                    price={`$${event.price}`}
                    category={event.category}
                  />
                ))}
              </div>
              {events.length >= 8 && !showMore && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowMore(true)}
                  >
                    Show More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">No events found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
