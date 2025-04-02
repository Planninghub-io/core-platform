
import React from 'react';
import { EventsHeroSection } from './EventsHeroSection';
import { EventsFeatureCards } from './EventsFeatureCards';
import { RecentEventsSection } from './RecentEventsSection';

interface EventsTabContentProps {
  onOpenAIAssistant: () => void;
}

export const EventsTabContent = ({ onOpenAIAssistant }: EventsTabContentProps) => {
  return (
    <div className="space-y-6">
      <EventsHeroSection onOpenAIAssistant={onOpenAIAssistant} />
      <EventsFeatureCards />
      <RecentEventsSection />
    </div>
  );
};
