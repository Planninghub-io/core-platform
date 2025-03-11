
import React from "react";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";

interface EventWithProfile {
  id: string;
  title: string;
  date: string;
  end_date: string;
  location: string | null;
  image_url: string | null;
  category: string | null;
  expected_attendees: number | null;
  status: string | null;
  user_profiles: {
    email: string | null;
  } | null;
}

interface EventSectionProps {
  title: string;
  events: EventWithProfile[];
  status: string;
  showFilters?: boolean;
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
}

const EventSection: React.FC<EventSectionProps> = ({
  title,
  events,
  status,
  showFilters = false,
  onDateRangeChange,
}) => {
  const filteredEvents = events.filter(event => event.status === status);
  
  if (filteredEvents.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {showFilters && onDateRangeChange && (
          <EventFilters onDateRangeChange={onDateRangeChange} />
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={new Date(event.date).toLocaleDateString()}
            endDate={new Date(event.end_date).toLocaleDateString()}
            location={event.location}
            imageUrl={event.image_url}
            category={event.category}
            createdBy="Event Creator" // Replace email with generic text
            expectedAttendees={event.expected_attendees}
          />
        ))}
      </div>
    </div>
  );
};

export default EventSection;
