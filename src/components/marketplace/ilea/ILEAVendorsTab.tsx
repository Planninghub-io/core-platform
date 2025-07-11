
import React from "react";
import { Compass } from "lucide-react";
import { ILEAVendorCard } from "./ILEAVendorCard";
import { ILEAVendor } from "@/types/ilea";

interface ILEAVendorsTabProps {
  vendors: ILEAVendor[] | undefined;
  isLoading: boolean;
  error: any;
  selectedCity: string;
}

export const ILEAVendorsTab: React.FC<ILEAVendorsTabProps> = ({ 
  vendors, 
  isLoading, 
  error, 
  selectedCity 
}) => {
  console.log("ILEAVendorsTab: vendors data:", vendors);
  console.log("ILEAVendorsTab: isLoading:", isLoading);
  console.log("ILEAVendorsTab: error:", error);
  console.log("ILEAVendorsTab: selectedCity:", selectedCity);

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
        <p>Failed to load ILEA vendors. Please try again later.</p>
        <p className="text-sm mt-1">Error: {error.message || error}</p>
      </div>
    );
  }

  if (!vendors || vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <Compass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No ILEA Vendors Found
        </h3>
        <p className="text-gray-500">
          {selectedCity 
            ? `No ILEA vendors found in ${selectedCity}. Try a different city.` 
            : "No ILEA vendors available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <ILEAVendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
};
