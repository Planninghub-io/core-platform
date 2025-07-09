
import React from "react";
import { Users } from "lucide-react";

export const ILEAMarketplaceHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">ILEA Marketplace</h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover premium venues and trusted vendors from the International Live Events Association (ILEA) network. 
        Connect with verified professionals who meet the highest industry standards.
      </p>
    </div>
  );
};
