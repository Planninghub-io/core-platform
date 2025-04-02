
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { MessageSquare, CalendarPlus } from 'lucide-react';

interface EventPreviewFooterProps {
  onBackToChat: () => void;
  onToggleEditMode: () => void;
  editMode: boolean;
  onCreateEvent: () => void;
  isCreating: boolean;
  isTitleEmpty: boolean;
}

export const EventPreviewFooter: React.FC<EventPreviewFooterProps> = ({
  onBackToChat,
  onToggleEditMode,
  editMode,
  onCreateEvent,
  isCreating,
  isTitleEmpty
}) => {
  return (
    <CardFooter className="flex justify-between pt-2">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBackToChat}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
        <Button variant="outline" onClick={onToggleEditMode}>
          {editMode ? 'View Mode' : 'Edit Event'}
        </Button>
      </div>
      <Button 
        onClick={onCreateEvent} 
        disabled={isCreating || isTitleEmpty}
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        {isCreating ? 'Creating...' : 'Create Event'}
      </Button>
    </CardFooter>
  );
};
