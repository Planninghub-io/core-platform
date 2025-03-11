
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Calendar, Star, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: any | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
}

interface VenueRecommendation {
  venueId: string;
  matchScore: number;
  reason: string;
  specialConsiderations: string;
  venue: Venue | null;
}

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social Gathering" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "other", label: "Other" }
];

export const VenueRecommendations: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [preferredFeatures, setPreferredFeatures] = useState("");
  const [recommendations, setRecommendations] = useState<VenueRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!location || !eventType) {
      toast({
        title: "Missing information",
        description: "Please provide both location and event type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('venue-recommendations', {
        body: { location, eventType, preferredFeatures },
      });
      
      if (error) throw error;
      
      setRecommendations(data.recommendations || []);
      
      toast({
        title: "Search complete",
        description: `Found ${data.recommendations.length} venue recommendations for your event`,
      });
    } catch (error) {
      console.error("Error searching for venues:", error);
      toast({
        title: "Error",
        description: "Failed to search for venues. Please try again.",
        variant: "destructive",
      });
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (score: number) => {
    const stars = Math.round(score / 20); // Convert 0-100 to 0-5 stars
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{score}% match</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Find Venue Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Tell us about your event, and our AI will recommend the perfect venues for you.
        </p>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="location"
                placeholder="City, state or region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Select
              value={eventType}
              onValueChange={setEventType}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="features">Preferred Features (Optional)</Label>
            <Input
              id="features"
              placeholder="e.g., outdoor space, catering"
              value={preferredFeatures}
              onChange={(e) => setPreferredFeatures(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <Button
          onClick={handleSearch}
          className="mt-6 bg-[#8b73f4] hover:bg-[#8b73f4]/90 gap-2"
        >
          <Search className="h-4 w-4" />
          Find Recommendations
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Loading recommendations...</h3>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searchPerformed && recommendations.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No recommendations found</h3>
          <p className="mt-2 text-gray-600">
            Try broadening your search criteria or checking a different location.
          </p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Recommended Venues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-[#f5f3ff] pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{rec.venue?.name || "Recommended Venue"}</span>
                    {renderStars(rec.matchScore)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {rec.venue?.capacity && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-[#8b73f4]" />
                        <span>Capacity: {rec.venue.capacity} people</span>
                      </div>
                    )}
                    {(rec.venue?.indoor_space_sqft || rec.venue?.outdoor_space_sqft) && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-[#8b73f4]" />
                        <span>
                          Space: {rec.venue.indoor_space_sqft ? `${rec.venue.indoor_space_sqft} sq ft indoor` : ''} 
                          {rec.venue.indoor_space_sqft && rec.venue.outdoor_space_sqft ? ' / ' : ''}
                          {rec.venue.outdoor_space_sqft ? `${rec.venue.outdoor_space_sqft} sq ft outdoor` : ''}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-medium text-gray-800 mb-1">Why this venue:</h4>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Special considerations:</h4>
                      <p className="text-sm text-gray-600">{rec.specialConsiderations}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button size="sm" className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
