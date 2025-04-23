
import { EventDetailsForm } from "../EventDetailsForm";

interface GeneratedEventSummaryProps {
  generatedEvent: any;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  handleCreateEvent?: () => void;
  prompt: string;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  onReview: () => void;
  // Add the missing property to the interface
}

export const GeneratedEventSummary = ({
  generatedEvent,
  eventTitle,
  setEventTitle,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  handleCreateEvent,
  prompt,
  hasMissingDate,
  hasMissingLocation,
  onReview
}: GeneratedEventSummaryProps) => {
  return (
    <div className="mt-6 p-4 bg-white shadow-md border border-gray-200 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <span>Your Generated Event</span>
        <button
          onClick={onReview}
          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors"
        >
          Review &amp; Submit
        </button>
      </h2>
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
        isCreating={false}
        handleCreateEvent={handleCreateEvent}
        prompt={prompt}
      />
    </div>
  );
};
