
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface CreateEventButtonProps {
  isCreating: boolean;
  eventTitle: string;
  location: string;
  handleCreateEvent: () => void;
  className?: string;
}

export const CreateEventButton = ({
  isCreating,
  eventTitle,
  location,
  handleCreateEvent,
  className = ""
}: CreateEventButtonProps) => {
  const isMissingRequiredFields = !eventTitle || !location;
  
  return (
    <Button
      onClick={handleCreateEvent}
      disabled={isMissingRequiredFields || isCreating}
      className={`w-full gap-2 ${className}`}
    >
      <CalendarPlus size={16} />
      {isCreating ? "Creating Event..." : "Create This Event"}
    </Button>
  );
};
