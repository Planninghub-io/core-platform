
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageSquare, Settings, Ticket, Link as LinkIcon, Share2 } from 'lucide-react';

interface EventProps {
  title: string;
  description: string;
  date?: string;
  location?: string;
  type?: string;
  category?: string;
  expected_attendees?: string;
  end_date?: string;
}

interface EventPreviewProps {
  event: EventProps;
  onBackToChat: () => void;
  onCreateEvent: () => void;
  isCreating: boolean;
}

export const EventPreview = ({ event, onBackToChat, onCreateEvent, isCreating }: EventPreviewProps) => {
  return (
    <>
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
            {(event.type || event.category) && (
              <div>
                <h3 className="text-sm font-medium mb-1">Event Type</h3>
                <p className="text-sm text-gray-600">{event.type || event.category}</p>
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
    </>
  );
};
