
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventImage } from "@/components/event-details/EventImage";
import { EventInfo } from "@/components/event-details/EventInfo";

interface EventWithProfile {
  id: string;
  title: string;
  date: string;
  end_date: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  category: string | null;
  expected_attendees: number | null;
  user_profiles: {
    email: string | null;
  } | null;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const { toast } = useToast();
  const [event, setEvent] = useState<EventWithProfile | null>(null);
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
            email
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

  const saveChanges = debounce(async (updates: Partial<EventWithProfile>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  }, 1000);

  const handleInputChange = (field: string, value: string | number) => {
    setEvent(prev => prev ? ({ ...prev, [field]: value }) : null);
    saveChanges({ [field]: value });
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-8">Event not found</div>;
  }

  return (
    <div className="container py-8">
      <EventHeader
        isEditing={isEditing}
        id={event.id}
        onBack={() => navigate('/events-hub')}
        onEditToggle={() => navigate(isEditing ? `/event/${id}` : `/event/${id}?edit=true`)}
        onDashboard={() => navigate(`/event/${id}/dashboard`)}
        onAiPlanner={() => navigate(`/event/${id}/ai-planner`)}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <EventImage
          imageUrl={event.image_url}
          isEditing={isEditing}
          onImageChange={(value) => handleInputChange('image_url', value)}
        />
        <EventInfo
          event={event}
          isEditing={isEditing}
          onFieldChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default EventDetails;
