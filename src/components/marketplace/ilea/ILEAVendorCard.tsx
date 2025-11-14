
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Building, ExternalLink, Phone, Mail, Globe, Star, Heart } from "lucide-react";
import { ILEAVendor } from "@/types/ilea";

interface ILEAVendorCardProps {
  vendor: ILEAVendor;
}

export const ILEAVendorCard: React.FC<ILEAVendorCardProps> = ({ vendor }) => {
  const getPriceRange = () => {
    if (vendor.price_range_start && vendor.price_range_end) {
      return `$${vendor.price_range_start.toLocaleString()} - $${vendor.price_range_end.toLocaleString()}`;
    } else if (vendor.price_range_start) {
      return `Starting at $${vendor.price_range_start.toLocaleString()}`;
    }
    return null;
  };

  const getLocation = () => {
    const parts = [];
    if (vendor.city) parts.push(vendor.city);
    if (vendor.zipcode) parts.push(vendor.zipcode);
    return parts.join(", ");
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 overflow-hidden">
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* ILEA Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/95 text-purple-700 hover:bg-white border-0 shadow-sm font-medium">
            ILEA Member
          </Badge>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white/95 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-800">4.9</span>
          </div>
        </div>

        {/* Placeholder Image with Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-105 transition-transform duration-300">
          <Building className="h-16 w-16 text-blue-400/60" />
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-700 transition-colors">
              {vendor.name}
            </h3>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs font-medium">
            Vendor Service
          </Badge>
        </div>

        {/* Description */}
        {vendor.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {vendor.description}
          </p>
        )}

        {/* Location & Price */}
        <div className="space-y-2">
          {getLocation() && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{getLocation()}</span>
            </div>
          )}
          
          {getPriceRange() && (
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">{getPriceRange()}</span>
            </div>
          )}
        </div>

        {/* Company Info */}
        {vendor.company && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <p className="font-medium text-gray-900 text-sm">{vendor.company.name}</p>
            <div className="flex flex-wrap gap-3">
              {vendor.company.business_phone && (
                <a
                  href={`tel:${vendor.company.business_phone}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </a>
              )}
              {vendor.company.business_email && (
                <a
                  href={`mailto:${vendor.company.business_email}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  <Mail className="h-3 w-3" />
                  <span>Email</span>
                </a>
              )}
              {vendor.company.website_url && (
                <a
                  href={vendor.company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Contact Button */}
        {vendor.company?.website_url && (
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl h-11 font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            <a
              href={vendor.company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <span>Contact Vendor</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
