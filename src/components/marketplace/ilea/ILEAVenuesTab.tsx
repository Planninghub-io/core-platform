
import React, { useMemo } from "react";
import { Building } from "lucide-react";
import { ILEAVenueCard } from "./ILEAVenueCard";
import { ILEAVenueListItem } from "./ILEAVenueListItem";
import { ILEAVenue } from "@/types/ilea";

interface ILEAVenuesTabProps {
  venues: ILEAVenue[] | undefined;
  isLoading: boolean;
  error: any;
  selectedCity: string;
  viewMode?: "grid" | "list";
  sortBy?: string;
}

export const ILEAVenuesTab: React.FC<ILEAVenuesTabProps> = ({ 
  venues, 
  isLoading, 
  error, 
  selectedCity,
  viewMode = "grid",
  sortBy = "name"
}) => {
  const sortedVenues = useMemo(() => {
    if (!venues) return [];
    
    const sorted = [...venues].sort((a, b) => {
      switch (sortBy) {
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "capacity":
          return (a.capacity || 0) - (b.capacity || 0);
        case "capacity_desc":
          return (b.capacity || 0) - (a.capacity || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return sorted;
  }, [venues, sortBy]);

  console.log("ILEAVenuesTab: venues data:", venues);
  console.log("ILEAVenuesTab: isLoading:", isLoading);
  console.log("ILEAVenuesTab: error:", error);
  console.log("ILEAVenuesTab: selectedCity:", selectedCity);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Finding venues...</h3>
            <p className="text-gray-600">Searching through our network of ILEA venues</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md mx-auto">
            <h3 className="font-medium mb-2">Unable to load venues</h3>
            <p className="text-sm">Error: {error.message || error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sortedVenues || sortedVenues.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Building className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No venues found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {selectedCity && selectedCity !== "all"
              ? `We couldn't find any ILEA venues in ${selectedCity}. Try searching in a different location or browse all venues.` 
              : "No ILEA venues are currently available. Check back soon for new listings from our verified members."}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {sortedVenues.map((venue) => (
          <ILEAVenueListItem key={venue.id} venue={venue} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {sortedVenues.map((venue) => (
        <ILEAVenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
