
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
      <div className="max-w-7xl mx-auto p-4">
        <EventGeneratorSection onCreateManualEvent={handleCreateManualEvent} />
      </div>
    </div>
  );
};

export default Index;
