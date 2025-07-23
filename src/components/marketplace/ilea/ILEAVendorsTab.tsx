
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
      <div className="bg-white rounded-2xl border border-gray-200 p-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Finding vendors...</h3>
            <p className="text-gray-600">Searching through our network of ILEA vendors</p>
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
            <h3 className="font-medium mb-2">Unable to load vendors</h3>
            <p className="text-sm">Error: {error.message || error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sortedVendors || sortedVendors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Compass className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No vendors found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {selectedCity && selectedCity !== "all"
              ? `We couldn't find any ILEA vendors in ${selectedCity}. Try searching in a different location or browse all vendors.` 
              : "No ILEA vendors are currently available. Check back soon for new listings from our verified members."}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {sortedVendors.map((vendor) => (
          <ILEAVendorListItem key={vendor.id} vendor={vendor} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {sortedVendors.map((vendor) => (
        <ILEAVendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
};
