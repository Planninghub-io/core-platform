
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventsHeroSectionProps {
  onOpenAIAssistant: () => void;
}

export const EventsHeroSection = ({ onOpenAIAssistant }: EventsHeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="relative px-6 py-12 md:px-10 md:py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold sm:text-4xl">Create and manage powerful campaign events</h2>
            <p className="text-white/80 leading-relaxed">
              Design events that engage supporters, build community, and drive action. From rallies to phonebanks to fundraisers, our platform helps you organize with ease.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="font-medium bg-white text-indigo-700 hover:bg-white/90" onClick={() => navigate('/create-event')}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={onOpenAIAssistant}>
                Use AI Assistant
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/placeholder.svg" 
              alt="Campaign Event" 
              className="h-full w-full object-cover rounded-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
