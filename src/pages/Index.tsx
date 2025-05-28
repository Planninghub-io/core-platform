
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventGeneratorSection from '@/components/EventGenerator/EventGeneratorSection';

const Index = () => {
  const navigate = useNavigate();

  const handleCreateManualEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="flex-1">
      {/* Main Header - What can I help you plan today? */}
      <div className="text-center mb-8 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 leading-tight max-w-4xl mx-auto px-4">
          What can I help you plan today?
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Create, discover, and experience amazing events. Start your journey with us today.
        </p>
      </div>
      
      <div className="container mx-auto py-8">
        <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
      </div>
    </div>
  );
};

export default Index;
