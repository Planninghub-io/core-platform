
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueRecommendations } from "@/components/venue-recommendations/VenueRecommendations";
import { useToast } from "@/components/ui/use-toast";
import VenueFilters, { VenueFilterValues } from "@/components/venue-filters/VenueFilters";
import { VenuesList } from "@/components/venue-browser/VenuesList";
import { useVenues } from "@/hooks/useVenues";
import { Sparkles } from "lucide-react";

const Venues = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<VenueFilterValues>({
    state: "Texas" // Default to Texas to show Austin venues
  });
  
  const { data: venues, isLoading, error, refetch } = useVenues(filters);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: VenueFilterValues) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Tabs defaultValue="browse" className="mb-4">
        <TabsList>
          <TabsTrigger value="browse">Venues</TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="browse" className="pt-4">
          <VenueFilters onFilterChange={handleFilterChange} />
          <VenuesList venues={venues} isLoading={isLoading} error={error} />
        </TabsContent>
        <TabsContent value="recommendations" className="pt-4">
          <VenueRecommendations />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Venues;
