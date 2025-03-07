
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import FeaturedEvent from '@/components/FeaturedEvent';
import SearchBar from '@/components/SearchBar';
import { EventGeneratorSection } from '@/components/EventGenerator/EventGeneratorSection';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const navigate = useNavigate();

  // Mock functions for component props
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

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

            <div className="mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="mb-12">
              <FeaturedEvent 
                title="Annual Music Festival 2023"
                description="Join us for three days of amazing performances from top artists across all genres."
                date="July 15-17, 2023"
                location="Central Park, New York"
                imageUrl="/placeholder.svg"
                price="$99"
              />
            </div>

            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <Button variant="outline" onClick={() => navigate('/events-hub')}>
                  View All
                </Button>
              </div>
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700">Discover upcoming events</h3>
                <p className="mt-2 text-gray-600">Check out our events hub to see all upcoming events</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => navigate('/events-hub')}
                >
                  Go to Events Hub
                </Button>
              </div>
            </div>

            <EventGeneratorSection />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
