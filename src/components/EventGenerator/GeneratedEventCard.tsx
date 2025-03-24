
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EditableEventFields } from "./EditableEventFields";
import { EventCardImage } from "./components/event-card/EventCardImage";
import { EventCardHeader } from "./components/event-card/EventCardHeader";
import { EventCardMetadata } from "./components/event-card/EventCardMetadata";
import { EventCardActions } from "./components/event-card/EventCardActions";
import { formatEventDate } from "./utils/dateFormatter";

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface GeneratedEventCardProps {
  event: GeneratedEvent;
  isCreating: boolean;
  eventId?: string;
  imageUrl?: string;
  onCreateEvent: () => void;
  eventTitle: string;
  onTitleChange: (title: string) => void;
  onDateChange?: (date: string) => void;
  onLocationChange?: (location: string) => void;
  selectedDate?: string;
  missingDate?: boolean;
  missingLocation?: boolean;
}

export const GeneratedEventCard = ({
  event,
  isCreating,
  eventId,
  imageUrl,
  onCreateEvent,
  eventTitle,
  onTitleChange,
  onDateChange,
  onLocationChange,
  selectedDate,
  missingDate = false,
  missingLocation = false,
}: GeneratedEventCardProps) => {
  // Auto-focus the title input if it's empty or a placeholder
  React.useEffect(() => {
    const isPlaceholder = eventTitle === 'Enter Event Name';
    if (isPlaceholder) {
      setTimeout(() => {
        const titleInput = document.querySelector('input[placeholder="Enter event title"]') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
        }
      }, 500);
    }
  }, [eventTitle]);

  const displayDate = selectedDate || event.date;
  const displayLocation = location || event.location; // Get the current location

  return (
    <Card className="mt-6 text-left">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <EventCardImage 
            imageUrl={imageUrl || event.imageUrl}
            eventTitle={eventTitle || event.title}
          />
        </div>
        <div className="flex-1 md:w-2/3">
          <EventCardHeader 
            eventTitle={eventTitle}
            onTitleChange={onTitleChange}
            displayDate={displayDate}
            formatDate={formatEventDate}
          />
          
          <CardContent className="space-y-4">
            <EventCardMetadata 
              location={event.location}
              category={event.category}
              estimatedPrice={event.estimatedPrice}
            />

            {/* Add editable fields for missing information */}
            {(missingDate || missingLocation) && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <EditableEventFields 
                  eventTitle={eventTitle}
                  onTitleChange={onTitleChange}
                  date={selectedDate || event.date}
                  onDateChange={(date) => onDateChange && onDateChange(date)}
                  location={event.location}
                  onLocationChange={(location) => onLocationChange && onLocationChange(location)}
                  missingDate={missingDate}
                  missingLocation={missingLocation}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2">
            <EventCardActions 
              eventId={eventId}
              isCreating={isCreating}
              eventTitle={eventTitle}
              location={location || event.location}
              onCreateEvent={onCreateEvent}
            />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
