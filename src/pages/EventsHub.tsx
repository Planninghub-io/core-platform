
import React from "react";
import SideNav from "@/components/SideNav";
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50">
          <SideNav />
          <main className="flex-1 p-6">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // If auth has completed and there's no user, return null (redirect happens in useAuth)
  if (!user) {
    return null;
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
            loading={eventsLoading}
            onSearch={handleSearch}
            onDateRangeChange={setDateRange}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EventsHub;
