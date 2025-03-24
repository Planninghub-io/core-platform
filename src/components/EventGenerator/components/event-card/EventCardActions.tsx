
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardActionsProps {
  eventId?: string;
  isCreating: boolean;
  eventTitle: string;
  onCreateEvent: () => void;
}

export const EventCardActions: React.FC<EventCardActionsProps> = ({
  eventId,
  isCreating,
  eventTitle,
  onCreateEvent
}) => {
  const navigate = useNavigate();

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
          disabled={isCreating || eventTitle === 'Enter Event Name' || !eventTitle.trim()}
          className="flex-1"
        >
          {isCreating ? 'Creating Event...' : 'Create This Event'}
        </Button>
      )}
    </>
  );
};
