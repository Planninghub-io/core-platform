
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import { VenueMatchScore } from "./VenueMatchScore";
import { Badge } from "@/components/ui/badge";

interface Venue {
  id: string;
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: any | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  source?: 'database' | 'web';
}

interface VenueRecommendation {
  venueId: string;
  matchScore: number;
  reason: string;
  specialConsiderations: string;
  venue: Venue | null;
}

interface VenueCardProps {
  recommendation: VenueRecommendation;
}

export const VenueCard: React.FC<VenueCardProps> = ({ recommendation }) => {
  const { venue, matchScore, reason, specialConsiderations } = recommendation;
  const isFromWeb = venue?.source === 'web';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-[#f5f3ff] pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{venue?.name || "Recommended Venue"}</span>
            {isFromWeb && <Badge variant="web">From web</Badge>}
          </div>
          <VenueMatchScore score={matchScore} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {venue?.capacity && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-[#8b73f4]" />
              <span>Capacity: {venue.capacity} people</span>
            </div>
          )}
          {(venue?.indoor_space_sqft || venue?.outdoor_space_sqft) && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-[#8b73f4]" />
              <span>
                Space: {venue.indoor_space_sqft ? `${venue.indoor_space_sqft} sq ft indoor` : ''} 
                {venue.indoor_space_sqft && venue.outdoor_space_sqft ? ' / ' : ''}
                {venue.outdoor_space_sqft ? `${venue.outdoor_space_sqft} sq ft outdoor` : ''}
              </span>
            </div>
          )}
          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium text-gray-800 mb-1">Why this venue:</h4>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Special considerations:</h4>
            <p className="text-sm text-gray-600">{specialConsiderations}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button size="sm" className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
