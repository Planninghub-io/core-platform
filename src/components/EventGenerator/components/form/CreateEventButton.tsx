
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
  // Add debug console log to verify when the button is clicked
  const handleClick = () => {
    console.log("Create event button clicked");
    handleCreateEvent();
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isCreating || eventTitle === 'Enter Event Name' || !eventTitle.trim() || !location}
      className="w-full"
    >
      {isCreating ? 'Creating Event...' : 'Create This Event'}
    </Button>
  );
};
