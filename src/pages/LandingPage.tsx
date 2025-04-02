
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="container py-8">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Event Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Create and manage your events with ease</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/campaign-hub">Campaign Hub</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/create-event">Create Event</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
