
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          What can I help you plan today?
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Create, discover, and experience amazing events. Start your journey with us today.
        </p>
        
        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-medium mb-1">👋 Welcome to Your AI Event Planner!</p>
                <p className="text-gray-600">Just type in the event details in the chat and I'll help you bring it to life!</p>
              </div>
            </div>
            
            <Link to="/create-event" className="block w-full">
              <Button className="w-full mt-4 py-6 text-lg" size="lg">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-[#8b73f4] hover:bg-[#7b63e4]">
            <Link to="/campaign-hub">Campaign Hub</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/create-event">Create Event</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
