
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarPlus, X } from "lucide-react";
import { formatEventDate } from "../utils/dateFormatter";
import { TitleField } from "./form/TitleField";
import { GeneratedEvent } from "@/hooks/event-generation/types";

interface EventFormReviewProps {
  event: GeneratedEvent;
  eventTitle: string;
  setEventTitle?: (title: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EventFormReview: React.FC<EventFormReviewProps> = ({
  event,
  eventTitle,
  setEventTitle,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = React.useState(eventTitle || event?.title || '');

  // Update parent state when title changes
  React.useEffect(() => {
    if (setEventTitle && title) {
      setEventTitle(title);
    }
  }, [title, setEventTitle]);

  // Handle the title change locally
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Create Your Event</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Review your event details before creating it
        </p>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        {/* Event Image */}
        {event?.imageUrl && (
          <div className="rounded-md overflow-hidden h-48">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Title */}
        <div className="space-y-2">
          <label htmlFor="event-title" className="text-sm font-medium">
            Event Title*
          </label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date</h3>
            <p className="p-2 bg-gray-50 rounded-md">
              {formatEventDate(event?.date || '')}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Location</h3>
            <p className="p-2 bg-gray-50 rounded-md">{event?.location || 'Not specified'}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Category</h3>
            <p className="p-2 bg-gray-50 rounded-md">{event?.category || 'Other'}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Budget</h3>
            <p className="p-2 bg-gray-50 rounded-md">{event?.estimatedPrice || 'Not specified'}</p>
          </div>
        </div>

        {/* Event Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <div className="p-2 bg-gray-50 rounded-md h-24 overflow-y-auto">
            {event?.description || 'No description provided.'}
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-between sm:justify-between gap-2 mt-4">
        <Button variant="outline" onClick={onClose} type="button">
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!title} 
          className="gap-2"
        >
          <CalendarPlus className="h-4 w-4" />
          Create Event
        </Button>
      </DialogFooter>
    </div>
  );
};
