
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
      <div className="text-center mb-16 pt-8">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gray-900 leading-tight">
          What can I help you plan today?
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
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
