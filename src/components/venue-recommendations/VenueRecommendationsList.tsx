
import React, { useState } from "react";
import { VenueCard } from "./VenueCard";
import { VenueRecommendationSkeleton } from "./VenueRecommendationSkeleton";
import { NoRecommendations } from "./NoRecommendations";
import { VenueDetails } from "../venue-browser/VenueDetails";
import { Venue } from "@/hooks/useVenues";

interface VenueRecommendation {
  venueId: string;
  matchScore: number;
  reason: string;
  specialConsiderations: string;
  venue: Venue | null;
}

interface VenueRecommendationsListProps {
  recommendations: VenueRecommendation[];
  isLoading: boolean;
  searchPerformed: boolean;
}

export const VenueRecommendationsList: React.FC<VenueRecommendationsListProps> = ({
  recommendations,
  isLoading,
  searchPerformed,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleViewDetails = (venue: Venue) => {
    setSelectedVenue(venue);
    setDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <VenueRecommendationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (searchPerformed && recommendations.length === 0) {
    return <NoRecommendations />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {recommendations.map((recommendation) => (
          <VenueCard 
            key={recommendation.venueId} 
            recommendation={recommendation} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      <VenueDetails 
        venue={selectedVenue} 
        isOpen={detailsOpen} 
        onClose={handleCloseDetails} 
      />
    </>
  );
};
