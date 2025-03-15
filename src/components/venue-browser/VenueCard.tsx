
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { Venue } from "@/hooks/useVenues";
import { Badge } from "@/components/ui/badge";

interface VenueCardProps {
  venue: Venue;
  onViewDetails: (venue: Venue) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onViewDetails }) => {
  // Check if venue has availability data
  const hasAvailabilityData = venue.availability && Array.isArray(venue.availability.dates);
  
  // Calculate availability percentage if data exists
  const availabilityPercentage = hasAvailabilityData 
    ? Math.round((1 - (venue.availability.dates.length / 30)) * 100)
    : null;

  // Determine if venue is verified (this would come from your database in a real implementation)
  const isVerified = venue.verified === true;

  return (
    <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardHeader className="bg-[#f5f3ff] pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{venue.name}</CardTitle>
          {isVerified && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {venue.capacity && (
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-[#8b73f4]" />
              <span>Capacity: {venue.capacity} people</span>
            </div>
          )}
          {(venue.indoor_space_sqft || venue.outdoor_space_sqft) && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-[#8b73f4]" />
              <span>
                Space: {venue.indoor_space_sqft ? `${venue.indoor_space_sqft} sq ft indoor` : ''} 
                {venue.indoor_space_sqft && venue.outdoor_space_sqft ? ' / ' : ''}
                {venue.outdoor_space_sqft ? `${venue.outdoor_space_sqft} sq ft outdoor` : ''}
              </span>
            </div>
          )}
          {hasAvailabilityData && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-[#8b73f4]" />
              <span>Availability: {availabilityPercentage}% available in next 30 days</span>
            </div>
          )}
          {venue.amenities && (
            <div className="mt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(venue.amenities).slice(0, 3).map(([key, value]) => (
                  value ? <span key={key} className="px-2 py-1 bg-[#f5f3ff] text-[#8b73f4] rounded-full text-xs">
                    {key.replace(/_/g, ' ')}
                  </span> : null
                ))}
                {venue.amenities && Object.values(venue.amenities).filter(Boolean).length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{Object.values(venue.amenities).filter(Boolean).length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-center items-center gap-4 mt-auto">
        {hasAvailabilityData && availabilityPercentage !== null && (
          <Badge 
            className={
              availabilityPercentage > 70 ? "bg-green-100 text-green-800 hover:bg-green-100" :
              availabilityPercentage > 30 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
              "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {availabilityPercentage > 70 ? "High Availability" :
             availabilityPercentage > 30 ? "Medium Availability" :
             "Low Availability"}
          </Badge>
        )}
        <Button 
          size="sm" 
          className="bg-[#8b73f4] hover:bg-[#8b73f4]/90"
          onClick={() => onViewDetails(venue)}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
