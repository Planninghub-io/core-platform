
import React from "react";
import SideNav from "@/components/SideNav";
import { SidebarProvider } from '@/components/ui/sidebar';
import EventsContent from "./events-hub/components/EventsContent";
import { useAuth } from "./events-hub/hooks/useAuth";
import { useEvents } from "./events-hub/hooks/useEvents";

const EventsHub = () => {
  console.log("EventsHub component rendering");
  
  const { user, loading: authLoading } = useAuth();
  const { 
    events, 
    loading: eventsLoading, 
    handleSearch, 
    setDateRange 
  } = useEvents(user);

  if (!user) {
    return null; // Will redirect due to useEffect in useAuth
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.user_metadata?.first_name || 'Event Planner'}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage and track all your events in one place.
            </p>
          </div>
          <EventsContent 
            events={events}
            loading={authLoading || eventsLoading}
            onSearch={handleSearch}
            onDateRangeChange={setDateRange}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EventsHub;
