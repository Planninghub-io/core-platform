
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarPlus, 
  MessageSquare, 
  Settings, 
  Ticket, 
  Link as LinkIcon, 
  Share2,
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock
} from 'lucide-react';

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
  // State for editable fields
  const [editMode, setEditMode] = useState(false);
  const [eventData, setEventData] = useState<EventProps>({...event});

  // Handle field changes
  const handleChange = (field: keyof EventProps, value: string) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Save changes and create event
  const handleCreateEvent = () => {
    // Use the edited event data when creating the event
    onCreateEvent();
  };

  return (
    <>
      <Card>
        <CardHeader>
          {editMode ? (
            <Input
              value={eventData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-xl font-semibold mb-1"
              placeholder="Event Title"
            />
          ) : (
            <CardTitle className="text-xl">{eventData.title}</CardTitle>
          )}
          
          {eventData.date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {editMode ? (
                <Input
                  type="datetime-local"
                  value={eventData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <CardDescription>{eventData.date}</CardDescription>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Description field */}
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            {editMode ? (
              <Textarea
                value={eventData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="min-h-[100px]"
                placeholder="Event Description"
              />
            ) : (
              <p className="text-sm text-gray-600">{eventData.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Location field */}
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              {editMode ? (
                <Input
                  value={eventData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Event Location"
                />
              ) : (
                <p className="text-sm text-gray-600">{eventData.location || 'To be determined'}</p>
              )}
            </div>
            
            {/* Event Type/Category field */}
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Event Type
              </h3>
              {editMode ? (
                <Input
                  value={eventData.category || eventData.type || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="Event Category"
                />
              ) : (
                <p className="text-sm text-gray-600">{eventData.type || eventData.category || 'General'}</p>
              )}
            </div>
          </div>
          
          {/* Additional details row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expected Attendees field */}
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Expected Attendees
              </h3>
              {editMode ? (
                <Input
                  value={eventData.expected_attendees || ''}
                  onChange={(e) => handleChange('expected_attendees', e.target.value)}
                  placeholder="Number of Attendees"
                  type="number"
                />
              ) : (
                <p className="text-sm text-gray-600">{eventData.expected_attendees || 'Not specified'}</p>
              )}
            </div>
            
            {/* End Date/Duration field */}
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                End Date
              </h3>
              {editMode ? (
                <Input
                  type="datetime-local"
                  value={eventData.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  placeholder="End Date & Time"
                />
              ) : (
                <p className="text-sm text-gray-600">{eventData.end_date || 'Not specified'}</p>
              )}
            </div>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBackToChat}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
            <Button variant="outline" onClick={toggleEditMode}>
              {editMode ? 'View Mode' : 'Edit Event'}
            </Button>
          </div>
          <Button 
            onClick={handleCreateEvent} 
            disabled={isCreating || !eventData.title.trim()}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Event'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-sm text-gray-500 italic mt-2">
        {editMode 
          ? 'Edit your event details before creating. All fields are optional except the title.'
          : 'Continue chatting to refine your event details before creating.'}
      </div>
    </>
  );
};
