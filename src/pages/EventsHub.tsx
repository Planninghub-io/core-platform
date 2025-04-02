
import React from "react";
import EventsContent from "./events-hub/components/EventsContent";
import { useAuth } from "./events-hub/hooks/useAuth";
import { useEvents } from "./events-hub/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const EventsHub = () => {
  console.log("EventsHub component rendering");
  
  const { user, loading: authLoading } = useAuth();
  const { 
    events, 
    loading: eventsLoading, 
    handleSearch, 
    setDateRange 
  } = useEvents(user);

  // Show loading state while authentication is in progress
  if (authLoading) {
    return (
      <div className="flex-1 p-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // If auth has completed and there's no user, return null (redirect happens in useAuth)
  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 p-6">
      <EventsContent 
        events={events}
        loading={eventsLoading}
        onSearch={handleSearch}
        onDateRangeChange={setDateRange}
      />
    </div>
  );
};

export default EventsHub;
