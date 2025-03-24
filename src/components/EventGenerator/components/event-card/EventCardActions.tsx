
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardActionsProps {
  eventId?: string;
  isCreating: boolean;
  eventTitle: string;
  location: string;
  onCreateEvent: () => void;
}

export const EventCardActions: React.FC<EventCardActionsProps> = ({
  eventId,
  isCreating,
  eventTitle,
  location,
  onCreateEvent
}) => {
  const navigate = useNavigate();
  
  const isDisabled = isCreating || 
    eventTitle === 'Enter Event Name' || 
    !eventTitle.trim() ||
    !location.trim();

  return (
    <>
      {eventId ? (
        <Button 
          onClick={() => navigate(`/event/${eventId}/edit`)}
          className="flex-1 gap-2"
          variant="outline"
        >
          <Pencil className="h-4 w-4" />
          Edit Event
        </Button>
      ) : (
        <Button 
          onClick={onCreateEvent}
          disabled={isDisabled}
          className="flex-1"
        >
          {isCreating ? 'Creating Event...' : 'Create This Event'}
        </Button>
      )}
    </>
  );
};
