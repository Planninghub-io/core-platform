
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import EventSection from "./EventSection";
import { LoadingState } from "@/pages/event-ticketing/components/LoadingState";
import type { EventWithProfile } from "../hooks/useEvents";

interface EventsContentProps {
  events: EventWithProfile[];
  loading: boolean;
  onSearch: (query: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

const EventsContent: React.FC<EventsContentProps> = ({
  events,
  loading,
  onSearch,
  onDateRangeChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events Hub</h1>
        <Button onClick={() => navigate("/create-event")} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={onSearch} />
      </div>

      <div className="space-y-12">
        {loading ? (
          <LoadingState />
        ) : events.length > 0 ? (
          <>
            <EventSection title="In Progress" events={events} status="in_progress" />
            <EventSection title="Upcoming" events={events} status="upcoming" />
            <EventSection 
              title="Completed" 
              events={events} 
              status="completed" 
              showFilters={true}
              onDateRangeChange={onDateRangeChange}
            />
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">No events found</div>
        )}
      </div>
    </div>
  );
};

export default EventsContent;
