
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, User, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          user_profiles (
            email,
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
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

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-8">Event not found</div>;
  }

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/events-hub')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[16/9] overflow-hidden rounded-xl">
          <img
            src={event.image_url || '/placeholder.svg'}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by {event.user_profiles?.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.expected_attendees || 'Not specified'} expected attendees</span>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <span className="text-sm font-medium">Category:</span>
            <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {event.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
