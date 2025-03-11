
import React from 'react';
import { VenueRecommendations as VenueRecommendationsComponent } from '@/components/VenueRecommendations';

const VenueRecommendations = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">AI Venue Recommendations</h1>
      <VenueRecommendationsComponent />
    </div>
  );
};

export default VenueRecommendations;
