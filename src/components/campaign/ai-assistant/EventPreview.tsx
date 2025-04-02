
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Share2, Link as LinkIcon, Settings, MessageSquare, CalendarPlus } from 'lucide-react';

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
}

interface EventPreviewProps {
  event: GeneratedEvent;
  onBackToChat: () => void;
  onCreateEvent: () => void;
  isCreating: boolean;
}

export const EventPreview = ({ event, onBackToChat, onCreateEvent, isCreating }: EventPreviewProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mt-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{event.title}</CardTitle>
          {event.date && (
            <CardDescription>{event.date}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {event.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {event.location && (
              <div>
                <h3 className="text-sm font-medium mb-1">Location</h3>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            )}
            {event.type && (
              <div>
                <h3 className="text-sm font-medium mb-1">Event Type</h3>
                <p className="text-sm text-gray-600">{event.type}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Event Options</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Ticket className="h-4 w-4 mr-2" />
                Add Ticketing
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Sharing Options
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <LinkIcon className="h-4 w-4 mr-2" />
                Custom URL
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                More Settings
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" onClick={onBackToChat}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <Button onClick={onCreateEvent} disabled={isCreating}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Event'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-gray-500 italic">
        Continue chatting to refine your event details before creating.
      </div>
    </div>
  );
};
