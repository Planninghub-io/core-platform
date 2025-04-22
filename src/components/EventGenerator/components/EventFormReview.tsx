
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GeneratedEvent } from "@/hooks/event-generation/types";

interface EventFormReviewProps {
  event: GeneratedEvent;
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
  return (
    <div className="space-y-4 py-4">
      <DialogHeader>
        <DialogTitle className="text-xl">Your Event Is Ready!</DialogTitle>
        <p className="text-gray-600 mt-2">
          Review the details below before creating your event.
        </p>
      </DialogHeader>
      
      <div className="space-y-4 mt-4">
        {/* Event image if available */}
        {event.imageUrl && (
          <div className="rounded-md overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={eventTitle || event.title || "Event"} 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        {/* Event details */}
        <div>
          <h3 className="font-semibold text-lg">{eventTitle || event.title}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{event.date || "Not specified"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p>{event.location || "Not specified"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p>{event.category || "Other"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p>{event.estimatedPrice || "Free"}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">{event.description}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between mt-6">
        <Button variant="outline" onClick={onClose}>
          Back to Chat
        </Button>
        <Button onClick={onSubmit} disabled={!eventTitle}>
          Create Event
        </Button>
      </DialogFooter>
    </div>
  );
};
