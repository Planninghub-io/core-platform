
import React from "react";
import { VenueCard } from "./VenueCard";
import { Venue } from "@/hooks/useVenues";

interface VenuesListProps {
  venues: Venue[] | undefined;
  isLoading: boolean;
  error: unknown;
}

export const VenuesList: React.FC<VenuesListProps> = ({ venues, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="col-span-3 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b73f4]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>Failed to load venues. Please try again later.</p>
      </div>
    );
  }

  if (venues && venues.length === 0) {
    return (
      <div className="col-span-3 text-center py-10">
        <h3 className="mt-2 text-lg font-medium text-gray-900">No venues found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues?.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
