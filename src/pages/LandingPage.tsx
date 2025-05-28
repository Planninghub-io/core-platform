
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  console.log("LandingPage component is rendering - checking header visibility");
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Event Generator Chat-like Interface */}
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#8b73f4] mb-2">👋 Welcome to Your AI Event Planner!</p>
                <p className="text-gray-700 mb-4">Just type in the event details in the chat and I'll help you bring it to life!</p>
                
                <Link to="/create-event" className="block w-full">
                  <Button className="w-full py-4 text-lg bg-[#8b73f4] hover:bg-[#7b63e4]" size="lg">
                    Get Started
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
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
