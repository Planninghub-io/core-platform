
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

  const onClick = () => {
    console.log("CreateEventButton: Create button clicked");
    console.log("CreateEventButton: isDisabled:", isDisabled);
    if (!isDisabled) {
      handleCreateEvent();
    }
  };

  return (
    <Button 
      onClick={onClick}
      disabled={isDisabled}
      className="w-full"
    >
      {isCreating ? 'Creating Event...' : 'Create This Event'}
    </Button>
  );
};
