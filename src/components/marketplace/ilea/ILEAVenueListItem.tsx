
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building, ExternalLink, Phone, Mail, Globe, Star } from "lucide-react";
import { ILEAVenue } from "@/types/ilea";

interface ILEAVenueListItemProps {
  venue: ILEAVenue;
}

export const ILEAVenueListItem: React.FC<ILEAVenueListItemProps> = ({ venue }) => {
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
    <Card className="hover:shadow-md transition-all duration-200 border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg relative overflow-hidden flex-shrink-0">
            <div className="absolute top-2 left-2">
              <Badge className="bg-white/90 text-purple-700 hover:bg-white/90 text-xs">
                ILEA Member
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-white/90 rounded-full p-1">
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building className="h-8 w-8 text-purple-600/60" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{venue.name}</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {getVenueType()}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {venue.location && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span className="line-clamp-1">{venue.location}</span>
                </div>
              )}
              {venue.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>{venue.capacity.toLocaleString()} capacity</span>
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
              <div className="pt-3 border-t">
                <h4 className="font-medium text-gray-900 text-sm mb-2">{venue.company.name}</h4>
                <div className="flex flex-wrap gap-4">
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
          </div>

          {/* Actions */}
          <div className="flex-shrink-0">
            {getBookingLink() && (
              <Button
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
