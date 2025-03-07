
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import { EventGeneratorSection } from '@/components/EventGenerator/EventGeneratorSection';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to EventPro</h1>
              <p className="mt-2 text-lg text-gray-600">
                Plan, manage, and promote your events with ease.
              </p>
            </div>

            <EventGeneratorSection />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
