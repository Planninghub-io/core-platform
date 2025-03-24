
import React from "react";
import { Button } from "@/components/ui/button";

interface CreateEventButtonProps {
  isCreating: boolean;
  eventTitle: string;
  location: string;
  handleCreateEvent: () => void;
}

export const CreateEventButton: React.FC<CreateEventButtonProps> = ({
  isCreating,
  eventTitle,
  location,
  handleCreateEvent
}) => {
  const isDisabled = isCreating || 
    eventTitle === 'Enter Event Name' || 
    !eventTitle.trim() ||
    !location.trim();

  return (
    <Button 
      onClick={handleCreateEvent}
      disabled={isDisabled}
      className="w-full"
    >
      {isCreating ? 'Creating Event...' : 'Create This Event'}
    </Button>
  );
};
