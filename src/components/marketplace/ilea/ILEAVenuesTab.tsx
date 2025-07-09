
import React from "react";
import { Building } from "lucide-react";
import { ILEAVenueCard } from "./ILEAVenueCard";

interface ILEAVenue {
  id: string;
  name: string;
  location?: string;
  city?: string;
  zipcode?: string;
  capacity?: number;
  amenities?: any;
  company?: {
    name: string;
    id: string;
    business_email?: string;
    business_phone?: string;
    website_url?: string;
    address?: string;
  };
}

interface ILEAVenuesTabProps {
  venues: ILEAVenue[] | undefined;
  isLoading: boolean;
  error: any;
  selectedCity: string;
}

export const ILEAVenuesTab: React.FC<ILEAVenuesTabProps> = ({ 
  venues, 
  isLoading, 
  error, 
  selectedCity 
}) => {
  console.log("ILEAVenuesTab: venues data:", venues);
  console.log("ILEAVenuesTab: isLoading:", isLoading);
  console.log("ILEAVenuesTab: error:", error);
  console.log("ILEAVenuesTab: selectedCity:", selectedCity);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <p>Failed to load ILEA venues. Please try again later.</p>
        <p className="text-sm mt-1">Error: {error.message || error}</p>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No ILEA Venues Found
        </h3>
        <p className="text-gray-500">
          {selectedCity 
            ? `No ILEA venues found in ${selectedCity}. Try a different city.` 
            : "No ILEA venues available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <ILEAVenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
