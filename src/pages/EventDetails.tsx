
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventImage } from "@/components/event-details/EventImage";
import { EventInfo } from "@/components/event-details/EventInfo";
import { EventAIDialog } from "@/components/event-details/EventAIDialog";
import { EventDashboard } from "@/components/event-details/EventDashboard";

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
  status?: string;
  user_profiles: {
    email: string | null;
  } | null;
}

type ViewMode = 'details' | 'ai' | 'dashboard';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const { toast } = useToast();
  const [event, setEvent] = useState<EventWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('details');

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        description: "Event deleted successfully",
      });
      navigate('/events-hub');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderLeftPanel = () => {
    switch (viewMode) {
      case 'ai':
        return (
          <div className="bg-card rounded-xl p-6 h-full">
            <EventAIDialog 
              event={event} 
              embedded={true} 
            />
          </div>
        );
      case 'dashboard':
        return (
          <div className="bg-card rounded-xl p-6 h-full">
            <EventDashboard event={event} />
          </div>
        );
      default:
        return (
          <EventImage
            imageUrl={event.image_url}
            isEditing={isEditing}
            onImageChange={(value) => handleInputChange('image_url', value)}
          />
        );
    }
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-8">Event not found</div>;
  }

  const renderContent = () => {
    if (viewMode === 'dashboard') {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <EventDashboard event={event} />
        </div>
      );
    }

    return (
      <div className="grid gap-8 md:grid-cols-2">
        {renderLeftPanel()}
        <EventInfo
          event={event}
          isEditing={isEditing}
          onFieldChange={handleInputChange}
        />
      </div>
    );
  };

  return (
    <div className="container py-8">
      <EventHeader
        isEditing={isEditing}
        id={event.id}
        onBack={() => navigate('/events-hub')}
        onEditToggle={() => navigate(isEditing ? `/event/${id}` : `/event/${id}?edit=true`)}
        onDashboard={() => setViewMode(viewMode === 'dashboard' ? 'details' : 'dashboard')}
        onAiAssistant={() => setViewMode(viewMode === 'ai' ? 'details' : 'ai')}
        onDelete={handleDelete}
        status={event.status}
        event={event}
        activeView={viewMode}
      />
      {renderContent()}
    </div>
  );
};

export default EventDetails;
