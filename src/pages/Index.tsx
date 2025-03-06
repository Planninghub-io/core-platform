
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import FeaturedEvent from '@/components/FeaturedEvent';
import SearchBar from '@/components/SearchBar';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import { EventGeneratorSection } from '@/components/EventGenerator/EventGeneratorSection';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const navigate = useNavigate();

  // Mock functions for component props
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    console.log('Date range changed:', range);
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
              <EventFilters onDateRangeChange={handleDateRangeChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <EventCard
                  id="1"
                  title="Tech Conference 2023"
                  date="2023-05-20T09:00:00"
                  endDate="2023-05-22T18:00:00"
                  location="San Francisco, CA"
                  imageUrl="/placeholder.svg"
                  category="Technology"
                  createdBy="John Smith"
                  expectedAttendees={500}
                />
                <EventCard
                  id="2"
                  title="Virtual Marketing Workshop"
                  date="2023-06-15T14:00:00"
                  endDate="2023-06-15T17:00:00"
                  location="Online"
                  imageUrl="/placeholder.svg"
                  category="Marketing"
                  createdBy="Emma Johnson"
                />
                <EventCard
                  id="3"
                  title="Music Festival"
                  date="2023-07-10T18:00:00"
                  endDate="2023-07-12T23:00:00"
                  location="Austin, TX"
                  imageUrl="/placeholder.svg"
                  category="Entertainment"
                  createdBy="David Wilson"
                  expectedAttendees={2000}
                />
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
