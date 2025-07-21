
import React, { useMemo } from "react";
import { Compass } from "lucide-react";
import { ILEAVendorCard } from "./ILEAVendorCard";
import { ILEAVendorListItem } from "./ILEAVendorListItem";
import { ILEAVendor } from "@/types/ilea";

interface ILEAVendorsTabProps {
  vendors: ILEAVendor[] | undefined;
  isLoading: boolean;
  error: any;
  selectedCity: string;
  viewMode?: "grid" | "list";
  sortBy?: string;
}

export const ILEAVendorsTab: React.FC<ILEAVendorsTabProps> = ({ 
  vendors, 
  isLoading, 
  error, 
  selectedCity,
  viewMode = "grid",
  sortBy = "name"
}) => {
  const sortedVendors = useMemo(() => {
    if (!vendors) return [];
    
    const sorted = [...vendors].sort((a, b) => {
      switch (sortBy) {
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "price":
          return (a.price_range_start || 0) - (b.price_range_start || 0);
        case "price_desc":
          return (b.price_range_start || 0) - (a.price_range_start || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return sorted;
  }, [vendors, sortBy]);

  console.log("ILEAVendorsTab: vendors data:", vendors);
  console.log("ILEAVendorsTab: isLoading:", isLoading);
  console.log("ILEAVendorsTab: error:", error);
  console.log("ILEAVendorsTab: selectedCity:", selectedCity);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
        <p className="text-center text-gray-600 mt-4">Loading vendors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Failed to load ILEA vendors</p>
          <p className="text-sm mt-1">Error: {error.message || error}</p>
        </div>
      </div>
    );
  }

  if (!sortedVendors || sortedVendors.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12">
        <div className="text-center">
          <Compass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No ILEA Vendors Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {selectedCity && selectedCity !== "all"
              ? `No ILEA vendors found in ${selectedCity}. Try searching in a different location.` 
              : "No ILEA vendors available at the moment. Check back later for new listings."}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {sortedVendors.map((vendor) => (
          <ILEAVendorListItem key={vendor.id} vendor={vendor} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedVendors.map((vendor) => (
        <ILEAVendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
};
