
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building, ExternalLink, Phone, Mail, Globe, Star } from "lucide-react";
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
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 group">
      {/* Image Placeholder */}
      <div className="aspect-[16/10] bg-gradient-to-br from-purple-100 to-purple-200 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-purple-700 hover:bg-white/90">
            ILEA Member
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 rounded-full p-2">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="h-12 w-12 text-purple-600/60" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {venue.name}
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
              {getVenueType()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Location */}
        {venue.location && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
            <span className="line-clamp-1">{venue.location}</span>
          </div>
        )}

        {/* Capacity and Space */}
        <div className="flex items-center justify-between">
          {venue.capacity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-purple-600" />
              <span>{venue.capacity.toLocaleString()}</span>
            </div>
          )}
          {getSpaceInfo() && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="h-4 w-4 text-purple-600" />
              <span>{getSpaceInfo()}</span>
            </div>
          )}
        </div>

        {/* Company Info */}
        {venue.company && (
          <div className="pt-3 border-t space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">{venue.company.name}</h4>
            <div className="flex flex-wrap gap-3">
              {venue.company.business_phone && (
                <a
                  href={`tel:${venue.company.business_phone}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </a>
              )}
              {venue.company.business_email && (
                <a
                  href={`mailto:${venue.company.business_email}`}
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
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
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Booking Button */}
        {getBookingLink() && (
          <Button
            asChild
            className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            size="sm"
          >
            <a
              href={getBookingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
