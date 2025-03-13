
import React, { useState } from "react";
import { VenueCard } from "./VenueCard";
import { VenueDetails } from "./VenueDetails";
import { Venue } from "@/hooks/useVenues";
import { AlertCircle } from "lucide-react";

interface VenuesListProps {
  venues: Venue[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const VenuesList: React.FC<VenuesListProps> = ({ venues, isLoading, error }) => {
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
      <div className="py-10">
        <div className="flex justify-center items-center space-x-2">
          <div className="h-4 w-4 bg-[#8b73f4] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 bg-[#8b73f4] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 bg-[#8b73f4] rounded-full animate-bounce"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Venues</h3>
        <p className="text-gray-600 max-w-md mx-auto">{error.message}</p>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Venues Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your filters or check back later for more venues.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {venues.map((venue) => (
          <VenueCard 
            key={venue.id} 
            venue={venue} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      <VenueDetails 
        venue={selectedVenue} 
        isOpen={detailsOpen} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
};
