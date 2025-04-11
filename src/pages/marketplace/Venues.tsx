
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueRecommendations } from "@/components/venue-recommendations/VenueRecommendations";
import { useToast } from "@/components/ui/use-toast";
import VenueFilters from "@/components/venue-filters/VenueFilters";
import { VenueFilterValues, useVenues } from "@/hooks/useVenues";
import { VenuesList } from "@/components/venue-browser/VenuesList";
import { Sparkles, RefreshCw, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Venues = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<VenueFilterValues>({});
  const [isScraping, setIsScraping] = useState(false);
  const [isScrapingVenues, setIsScrapingVenues] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  
  const { venues, isLoading, error, refetch } = useVenues(filters);
  
  // Effect to fetch venues when filters change
  useEffect(() => {
    refetch();
  }, [filters]);

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
  
  // Function to trigger venue scraping for multiple cities
  const handleScrapeVenues = async () => {
    setIsScrapingVenues(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You need to be logged in to use this feature",
          variant: "destructive",
        });
        setIsScrapingVenues(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('scrape-venues', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error("Error scraping venues:", error);
        toast({
          title: "Error",
          description: "Failed to scrape venues. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      // Refetch venue data to show the newly added venues
      await refetch();
      
      if (data.venues && data.venues.length > 0) {
        toast({
          title: "Success",
          description: `Successfully added ${data.venues.length} new venues from Texas cities`,
        });
      } else if (data.message?.includes('No new venues')) {
        toast({
          title: "Info",
          description: "No new venues found. All venues are already in the database.",
        });
      } else {
        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (err: any) {
      console.error("Error in scrape venues process:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScrapingVenues(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <div className="bg-[#f9f8ff] p-6 mb-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Find the Perfect Venue</h1>
        <p className="text-gray-600 max-w-3xl">
          Browse our curated selection of venues, check real-time availability, and request proposals from multiple venues with just a few clicks.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="browse">Venues</TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScrapeVenues}
              disabled={isScrapingVenues}
            >
              <DownloadCloud className={`h-4 w-4 mr-2 ${isScrapingVenues ? 'animate-bounce' : ''}`} />
              {isScrapingVenues ? 'Collecting Venues...' : 'Load City Venues'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScrapeCalendars}
              disabled={isScraping}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isScraping ? 'animate-spin' : ''}`} />
              Update Availability
            </Button>
          </div>
        </div>
        
        <TabsContent value="browse" className="pt-4">
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <VenueFilters onFilterChange={handleFilterChange} />
          </div>
          <VenuesList venues={venues} isLoading={isLoading} error={error} />
        </TabsContent>
        <TabsContent value="recommendations" className="pt-4">
          <VenueRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Venues;
