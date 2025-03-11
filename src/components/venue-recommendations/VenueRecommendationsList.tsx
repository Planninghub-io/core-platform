
import React from "react";
import { VenueCard } from "./VenueCard";
import { VenueRecommendationsLoading } from "./VenueRecommendationSkeleton";
import { NoRecommendations } from "./NoRecommendations";

interface Venue {
  id: string;
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: any | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  source?: 'database' | 'web';
}

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
  searchPerformed
}) => {
  if (isLoading) {
    return <VenueRecommendationsLoading />;
  }

  if (searchPerformed && recommendations.length === 0) {
    return <NoRecommendations />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Recommended Venues</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <VenueCard key={index} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};
