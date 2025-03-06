
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import SideNav from "@/components/SideNav";
import FeaturedEvent from '@/components/FeaturedEvent';
import SearchBar from '@/components/SearchBar';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import EventGeneratorSection from '@/components/EventGenerator/EventGeneratorSection';

const Index = () => {
  const navigate = useNavigate();

  return (
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
            <SearchBar />
          </div>

          <div className="mb-12">
            <FeaturedEvent />
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Button variant="outline" onClick={() => navigate('/events-hub')}>
                View All
              </Button>
            </div>
            <EventFilters />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <EventCard
                id="1"
                title="Tech Conference 2023"
                description="Join us for the biggest tech event of the year."
                date="2023-05-20T09:00:00"
                image="/placeholder.svg"
                location="San Francisco, CA"
                isVirtual={false}
              />
              <EventCard
                id="2"
                title="Virtual Marketing Workshop"
                description="Learn from the best marketers in the industry."
                date="2023-06-15T14:00:00"
                image="/placeholder.svg"
                location="Online"
                isVirtual={true}
              />
              <EventCard
                id="3"
                title="Music Festival"
                description="Experience three days of amazing performances."
                date="2023-07-10T18:00:00"
                image="/placeholder.svg"
                location="Austin, TX"
                isVirtual={false}
              />
            </div>
          </div>

          <EventGeneratorSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
