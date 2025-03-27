
import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import { SidebarProvider } from '@/components/ui/sidebar';

// Lazy load the EventGeneratorSection to improve initial page load
const EventGeneratorSection = lazy(() => 
  import('@/components/EventGenerator/EventGeneratorSection').then(module => ({
    default: module.EventGeneratorSection
  }))
);

const Index = () => {
  const navigate = useNavigate();

  // Create a handler for manual event creation
  const handleCreateManualEvent = () => {
    navigate('/create-event');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
