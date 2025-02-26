
import { EventImage } from "./EventImage";
import { EventInfo } from "./EventInfo";
import { EventAIDialog } from "./EventAIDialog";
import { EventDashboard } from "./EventDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
}

interface EventContentProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onFieldChange: (field: string, value: string | number) => void;
}

export const EventContent = ({
  event,
  isEditing,
  viewMode,
  onFieldChange
}: EventContentProps) => {
  const navigate = useNavigate();
  const [hasInvites, setHasInvites] = useState(false);
  const [hasTicketing, setHasTicketing] = useState(false);

  useEffect(() => {
    checkInvitesAndTicketing();
  }, [event.id]);

  const checkInvitesAndTicketing = async () => {
    try {
      // Check for invites
      const { data: invitations } = await supabase
        .from('invitations')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);
      
      setHasInvites(invitations && invitations.length > 0);

      // Check for ticketing
      const { data: ticketing } = await supabase
        .from('event_ticketing')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);
      
      setHasTicketing(ticketing && ticketing.length > 0);
    } catch (error) {
      console.error('Error checking invites and ticketing:', error);
    }
  };

  if (viewMode === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <EventDashboard event={event} />
      </div>
    );
  }

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
      default:
        return (
          <div>
            <EventImage
              imageUrl={event.image_url}
              isEditing={isEditing}
              onImageChange={(value) => onFieldChange('image_url', value)}
            />
          </div>
        );
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', event.id);

        if (error) throw error;
        navigate('/events-hub');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-8">
        {renderLeftPanel()}
        <div className="flex gap-4 mt-auto pt-[440px]">
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${event.id}/invitations`)}
            className="flex-1"
          >
            {hasInvites ? 'Invites' : 'Add Invite'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/event/${event.id}/ticketing`)}
            className="flex-1"
          >
            {hasTicketing ? 'Ticketing' : 'Add Ticketing'}
          </Button>
        </div>
      </div>
      <EventInfo
        event={event}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
        onDelete={handleDelete}
      />
    </div>
  );
};
