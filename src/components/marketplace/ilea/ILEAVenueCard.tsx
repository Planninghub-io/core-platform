
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building, ExternalLink, Phone, Mail, Globe, Star, Heart } from "lucide-react";
import { ILEAVenue } from "@/types/ilea";

interface ILEAVenueCardProps {
  venue: ILEAVenue;
}

export const ILEAVenueCard: React.FC<ILEAVenueCardProps> = ({ venue }) => {
  const getVenueType = () => {
    if (!venue.amenities) return "Venue";
    const venueType = venue.amenities.venue_type;
    if (!venueType) return "Venue";
    return venueType.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const getSpaceInfo = () => {
    if (!venue.amenities) return null;
    const spaceSqft = venue.amenities.space_sqft;
    if (spaceSqft) {
      return `${spaceSqft.toLocaleString()} sq ft`;
    }
    return null;
  };

  const getBookingLink = () => {
    if (venue.amenities?.booking_link) {
      return venue.amenities.booking_link;
    }
    return venue.company?.website_url;
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
      {/* Image Container - Airbnb style */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 overflow-hidden">
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
            <span className="text-xs font-medium text-gray-800">4.8</span>
          </div>
        </div>

        {/* Placeholder Image with Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 group-hover:scale-105 transition-transform duration-300">
          <Building className="h-16 w-16 text-purple-400/60" />
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-700 transition-colors">
              {venue.name}
            </h3>
          </div>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs font-medium">
            {getVenueType()}
          </Badge>
        </div>

        {/* Location */}
        {venue.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{venue.location}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {venue.capacity && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{venue.capacity.toLocaleString()} guests</span>
            </div>
          )}
          {getSpaceInfo() && (
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-gray-400" />
              <span>{getSpaceInfo()}</span>
            </div>
          )}
        </div>

        {/* Company Info */}
        {venue.company && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <p className="font-medium text-gray-900 text-sm">{venue.company.name}</p>
            <div className="flex flex-wrap gap-3">
              {venue.company.business_phone && (
                <a
                  href={`tel:${venue.company.business_phone}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </a>
              )}
              {venue.company.business_email && (
                <a
                  href={`mailto:${venue.company.business_email}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  <Mail className="h-3 w-3" />
                  <span>Email</span>
                </a>
              )}
              {venue.company.website_url && (
                <a
                  href={venue.company.website_url}
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

        {/* Action Button */}
        {getBookingLink() && (
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl h-11 font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            <a
              href={getBookingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <span>View Details</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
