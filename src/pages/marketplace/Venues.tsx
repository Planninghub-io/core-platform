
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueRecommendations } from "@/components/venue-recommendations/VenueRecommendations";
import { useToast } from "@/components/ui/use-toast";
import VenueFilters, { VenueFilterValues } from "@/components/venue-filters/VenueFilters";
import { VenuesList } from "@/components/venue-browser/VenuesList";
import { useVenues } from "@/hooks/useVenues";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Venues = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<VenueFilterValues>({
    state: "Texas" // Default to Texas to show Austin venues
  });
  const [isScraping, setIsScraping] = useState(false);
  
  const { data: venues, isLoading, error, refetch } = useVenues(filters);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: VenueFilterValues) => {
    setFilters(newFilters);
  };

  // Function to trigger venue calendar scraping
  const handleScrapeCalendars = async () => {
    setIsScraping(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('venue-availability', {
        method: 'POST'
      });
      
      if (error) {
        console.error("Error scraping venue calendars:", error);
        toast({
          title: "Error",
          description: "Failed to update venue availability",
          variant: "destructive",
        });
      } else {
        console.log("Venue calendar scraping response:", data);
        toast({
          title: "Success",
          description: `Successfully updated availability for ${data.venues?.length || 0} venues`,
        });
        
        // Refetch venues to get updated availability data
        refetch();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="browse" className="flex-grow">
          <TabsList>
            <TabsTrigger value="browse">Venues</TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleScrapeCalendars}
          disabled={isScraping}
          className="ml-2"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isScraping ? 'animate-spin' : ''}`} />
          Update Availability
        </Button>
      </div>
      
      <TabsContent value="browse" className="pt-4">
        <VenueFilters onFilterChange={handleFilterChange} />
        <VenuesList venues={venues} isLoading={isLoading} error={error} />
      </TabsContent>
      <TabsContent value="recommendations" className="pt-4">
        <VenueRecommendations />
      </TabsContent>
    </>
  );
};

export default Venues;
