
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
      <div className="bg-white rounded-lg border p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Failed to load ILEA venues</p>
          <p className="text-sm mt-1">Error: {error.message || error}</p>
        </div>
      </div>
    );
  }

  if (!sortedVenues || sortedVenues.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No ILEA Venues Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {selectedCity && selectedCity !== "all"
              ? `No ILEA venues found in ${selectedCity}. Try searching in a different location.` 
              : "No ILEA venues available at the moment. Check back later for new listings."}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {sortedVenues.map((venue) => (
          <ILEAVenueListItem key={venue.id} venue={venue} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedVenues.map((venue) => (
        <ILEAVenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
