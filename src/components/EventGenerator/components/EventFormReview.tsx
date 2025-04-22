
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GeneratedEvent } from "@/hooks/event-generation/types";
import { Calendar, MapPin, Tag, DollarSign } from "lucide-react";

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
        
        {/* Event title input */}
        <div className="space-y-2">
          <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            id="eventTitle"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Enter event title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        
        {/* Event details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{event.date || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Tag className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{event.category || "Other"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-purple-600 mt-0.5" />
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
          disabled={!eventTitle} 
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
        >
          Create Event
        </Button>
      </DialogFooter>
    </div>
  );
};
