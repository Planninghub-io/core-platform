
import React from "react";
import { Users, Star, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ILEAMarketplaceHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Users className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">ILEA Marketplace</h1>
      </div>
      
      <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Discover premium venues and trusted vendors from the International Live Events Association (ILEA) network. 
        Connect with verified professionals who meet the highest industry standards.
      </p>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-6 pt-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm text-gray-600">Verified Members</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span className="text-sm text-gray-600">Industry Standards</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-purple-600" />
          <span className="text-sm text-gray-600">Premium Quality</span>
        </div>
      </div>

      {/* ILEA Badge */}
      <div className="flex justify-center pt-2">
        <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
          International Live Events Association Network
        </Badge>
      </div>
    </div>
  );
};
