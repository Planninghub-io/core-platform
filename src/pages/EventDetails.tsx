
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventContent } from "@/components/event-details/EventContent";
import { useEventData } from "@/hooks/useEventData";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [viewMode, setViewMode] = useState<'details' | 'ai' | 'dashboard'>('details');
  
  const { event, loading, handleInputChange, handleDelete } = useEventData(id!);

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-8">Event not found</div>;
  }

  const handleDeleteAndNavigate = async () => {
    const success = await handleDelete();
    if (success) {
      navigate('/events-hub');
    }
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
        onDelete={handleDeleteAndNavigate}
        status={event.status}
        event={event}
        activeView={viewMode}
      />
      <EventContent
        event={event}
        isEditing={isEditing}
        viewMode={viewMode}
        onFieldChange={handleInputChange}
      />
    </div>
  );
};

export default EventDetails;
