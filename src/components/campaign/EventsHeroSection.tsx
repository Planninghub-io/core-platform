
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CampaignAIAssistant } from '@/components/campaign/ai-assistant/CampaignAIAssistant';

interface EventsHeroSectionProps {
  onOpenAIAssistant: () => void;
}

export const EventsHeroSection = ({ onOpenAIAssistant }: EventsHeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Create and manage powerful campaign events</h2>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              Design events that engage supporters, build community, and drive action. From rallies to phonebanks to fundraisers, our platform helps you organize with ease.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="font-medium bg-white text-indigo-700 hover:bg-white/90" onClick={() => navigate('/create-event')}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <CampaignAIAssistant onClose={() => {}} displayInline={true} />
          </div>
        </div>
      </div>
    </section>
  );
};
