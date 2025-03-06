
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SideNav } from "@/components/SideNav";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ArrowRight, CalendarIcon } from "lucide-react";

type Venue = {
  id: string;
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: any | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
};

const fetchVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from("venues")
    .select("*");
  
  if (error) {
    console.error("Error fetching venues:", error);
    throw new Error("Failed to fetch venues");
  }
  
  return data || [];
};

const Venues = () => {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ["venues"],
    queryFn: fetchVenues,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNav />
      <main className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Venue Marketplace</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find the perfect venue for your next event
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b73f4]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p>Failed to load venues. Please try again later.</p>
          </div>
        )}

        {venues && venues.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No venues found</h3>
            <p className="mt-1 text-gray-500">Check back later for available venues.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues?.map((venue) => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-[#f5f3ff] pb-0">
                <CardTitle className="text-xl">{venue.name}</CardTitle>
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
              <CardFooter className="bg-gray-50 border-t flex justify-between">
                <div className="text-sm text-gray-500">
                  {venue.booking_policy ? "Booking policy available" : ""}
                </div>
                <Button size="sm" className="bg-[#8b73f4] hover:bg-[#8b73f4]/90">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Venues;
