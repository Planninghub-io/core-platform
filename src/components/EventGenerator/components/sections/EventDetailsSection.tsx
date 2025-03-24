
import { EventDetailsForm } from "../EventDetailsForm";
import { GeneratedEvent } from "@/hooks/event-generation/types";

interface EventDetailsSectionProps {
  generatedEvent: GeneratedEvent;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  isCreating: boolean;
  handleCreateEvent: () => void;
  prompt: string;
}

export const EventDetailsSection = ({
  generatedEvent,
  eventTitle,
  setEventTitle,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  hasMissingDate,
  hasMissingLocation,
  isCreating,
  handleCreateEvent,
  prompt
}: EventDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Display event image */}
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={generatedEvent.imageUrl || "/placeholder.svg"}
          alt={eventTitle || generatedEvent.title || "Event"}
          className="w-full h-[200px] object-cover animate-fade-in rounded-lg"
        />
      </div>
      
      {/* Show event details form for editing */}
      <EventDetailsForm 
        event={generatedEvent}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        location={location}
        setLocation={setLocation}
        hasMissingDate={hasMissingDate}
        hasMissingLocation={hasMissingLocation}
        isCreating={isCreating}
        handleCreateEvent={handleCreateEvent}
        prompt={prompt}
      />
    </div>
  );
};
