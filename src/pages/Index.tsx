
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import { EventGeneratorSection } from '@/components/EventGenerator/EventGeneratorSection';
import { SidebarProvider } from '@/components/ui/sidebar';

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
            <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
