
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GeneratedEvent } from "@/hooks/event-generation/types";
import { Calendar, MapPin, Tag, DollarSign, Users } from "lucide-react";

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
  // Format date for better display if available
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : "Not specified";

  // Initialize local state with event title or generated title
  const [localTitle, setLocalTitle] = useState(eventTitle || event.title || "");

  // Update eventTitle when local title changes
  useEffect(() => {
    if (localTitle) {
      setEventTitle(localTitle);
    }
  }, [localTitle, setEventTitle]);

  // Effect to initialize title from event when component mounts
  useEffect(() => {
    if (!eventTitle && event.title) {
      setLocalTitle(event.title);
    }
  }, [event, eventTitle]);

  return (
    <div className="space-y-4 py-4">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-purple-700">Your Event Is Ready!</DialogTitle>
        <p className="text-gray-600 mt-2">
          Review the details below before creating your event.
        </p>
      </DialogHeader>
      
      <div className="space-y-6 mt-4">
        {/* Event image if available */}
        {event.imageUrl && (
          <div className="rounded-md overflow-hidden shadow-md">
            <img 
              src={event.imageUrl} 
              alt={localTitle || "Event"} 
              className="w-full h-56 object-cover"
            />
          </div>
        )}
        
        {/* Event title input */}
        <div className="space-y-2">
          <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            id="eventTitle"
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Enter event title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        {/* Event details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{event.category || "Other"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">{event.estimatedPrice || "Free"}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between mt-6 gap-4">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Back to Chat
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!localTitle} 
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
        >
          Create Event
        </Button>
      </DialogFooter>
    </div>
  );
};
