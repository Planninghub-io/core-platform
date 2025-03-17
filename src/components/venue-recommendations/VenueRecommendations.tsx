
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VenueSearchForm } from "./VenueSearchForm";
import { VenueRecommendationsList } from "./VenueRecommendationsList";
import { VenueRecommendation } from "@/hooks/useVenues";

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

  return (
    <div className="space-y-6">
      <VenueSearchForm
        location={location}
        setLocation={setLocation}
        eventType={eventType}
        setEventType={setEventType}
        preferredFeatures={preferredFeatures}
        setPreferredFeatures={setPreferredFeatures}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <VenueRecommendationsList
        recommendations={recommendations}
        isLoading={isLoading}
        searchPerformed={searchPerformed}
      />
    </div>
  );
};
