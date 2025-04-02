
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
      <div className="container mx-auto py-8">
        <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
      </div>
    </div>
  );
};

export default Index;
