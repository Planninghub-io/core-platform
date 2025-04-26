
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GeneratedEventSummaryProps {
  generatedEvent: any;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  handleCreateEvent: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  showDetailsForm: boolean;
}

export const GeneratedEventSummary = ({
  generatedEvent,
  eventTitle,
  setEventTitle,
  handleCreateEvent,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  hasMissingDate,
  hasMissingLocation,
  showDetailsForm
}: GeneratedEventSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  if (!generatedEvent) return null;
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(e.target.value);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium">Event Generated</h3>
        </div>
      </div>
      
      <Card className="p-4 border border-green-100 bg-green-50">
        <div className="space-y-4">
          <div>
            {isEditing ? (
              <Input
                value={eventTitle}
                onChange={handleTitleChange}
                placeholder="Event Title"
                className="text-lg font-semibold"
                autoFocus
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              />
            ) : (
              <h3 
                className="text-lg font-semibold cursor-pointer hover:underline" 
                onClick={() => setIsEditing(true)}
                title="Click to edit title"
              >
                {eventTitle || generatedEvent.title || "New Event"}
              </h3>
            )}
            <p className="text-sm text-gray-600 line-clamp-2">
              {generatedEvent.description}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(generatedEvent.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{generatedEvent.location}</span>
            </div>
          </div>
          
          <Button
            onClick={handleCreateEvent}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          >
            Create This Event <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};