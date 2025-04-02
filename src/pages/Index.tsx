
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SideNav from "@/components/SideNav";
import EventGeneratorSection from '@/components/EventGenerator/EventGeneratorSection';

const Index = () => {
  const navigate = useNavigate();

  const handleCreateManualEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
        </div>
      </main>
    </div>
  );
};

export default Index;
