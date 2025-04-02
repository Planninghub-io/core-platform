
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EventPreviewCard } from './event-preview/EventPreviewCard';
import { EventPreviewDescription } from './event-preview/EventPreviewDescription';
import { EventPreviewDetails } from './event-preview/EventPreviewDetails';
import { EventPreviewOptions } from './event-preview/EventPreviewOptions';
import { EventPreviewFooter } from './event-preview/EventPreviewFooter';

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
        <EventPreviewCard 
          title={eventData.title}
          date={eventData.date}
          editMode={editMode}
          onTitleChange={handleChange}
        />
        
        <CardContent className="space-y-4">
          <EventPreviewDescription 
            description={eventData.description}
            editMode={editMode}
            onFieldChange={handleChange}
          />
          
          <EventPreviewDetails 
            location={eventData.location}
            category={eventData.category}
            type={eventData.type}
            expected_attendees={eventData.expected_attendees}
            end_date={eventData.end_date}
            editMode={editMode}
            onFieldChange={handleChange}
          />
          
          <EventPreviewOptions />
        </CardContent>
        
        <EventPreviewFooter 
          onBackToChat={onBackToChat}
          onToggleEditMode={toggleEditMode}
          editMode={editMode}
          onCreateEvent={handleCreateEvent}
          isCreating={isCreating}
          isTitleEmpty={!eventData.title.trim()}
        />
      </Card>
      
      <div className="text-sm text-gray-500 italic mt-2">
        {editMode 
          ? 'Edit your event details before creating. All fields are optional except the title.'
          : 'Continue chatting to refine your event details before creating.'}
      </div>
    </>
  );
};
