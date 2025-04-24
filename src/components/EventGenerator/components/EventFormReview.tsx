
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EventFormReviewProps {
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
    category?: string;
    estimatedPrice?: string;
  };
  eventTitle: string;
  setEventTitle: (title: string) => void;
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
  // Auto-focus the title input when the form opens
  useEffect(() => {
    const timer = setTimeout(() => {
      const titleInput = document.getElementById('event-title-input');
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug log to track rendering
  useEffect(() => {
    console.log("EventFormReview rendered with:", { 
      event, 
      eventTitle 
    });
  }, [event, eventTitle]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-title-input" className="font-medium">
          Event Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-title-input"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          placeholder="Enter event title"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Date</Label>
        <Input value={event.date} disabled className="bg-gray-50" />
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Location</Label>
        <Input value={event.location} disabled className="bg-gray-50" />
      </div>

      {event.category && (
        <div className="space-y-2">
          <Label className="font-medium">Category</Label>
          <Input value={event.category} disabled className="bg-gray-50" />
        </div>
      )}

      {event.estimatedPrice && (
        <div className="space-y-2">
          <Label className="font-medium">Estimated Budget</Label>
          <Input value={event.estimatedPrice} disabled className="bg-gray-50" />
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-medium">Description</Label>
        <Textarea
          value={event.description}
          disabled
          className="w-full min-h-[100px] bg-gray-50"
        />
      </div>

      <p className="text-sm text-gray-500 italic">
        After creating the event, you can edit all details from the Events Hub.
      </p>
    </div>
  );
};
