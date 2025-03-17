
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Venue = {
  id: string;
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: any | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  verified?: boolean;
  availability?: {
    dates: string[];
  };
};

export type VenueFilterValues = {
  city?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  availabilityDate?: Date;
  verifiedOnly?: boolean;
};

export const useVenues = (filters: VenueFilterValues) => {
  // Function to fetch venues with filters
  const fetchVenues = async (): Promise<Venue[]> => {
    // Start with a basic query that selects everything from venues
    let query = supabase.from("venues").select("*");
    
    // Apply filters one by one
    if (filters.city) {
      // This is a basic implementation. In a real app, we'd need to extract city from address or have a city column
      query = query.ilike('name', `%${filters.city}%`);
    }
    
    if (filters.capacity?.min) {
      query = query.gte('capacity', filters.capacity.min);
    }
    
    if (filters.verifiedOnly) {
      query = query.eq('verified', true);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching venues:", error);
      throw new Error("Failed to fetch venues");
    }
    
    // Process the venues to ensure they have the correct structure
    const processedVenues: Venue[] = [];
    
    if (data) {
      for (const venue of data) {
        // Create a basic venue object with an empty availability dates array
        const processedVenue: Venue = {
          ...venue,
          availability: {
            dates: []
          }
        };
        
        // Safely extract availability dates if they exist
        if (venue.availability && typeof venue.availability === 'object') {
          const availObj = venue.availability as any;
          
          if (Array.isArray(availObj.dates)) {
            // Filter to only include string values
            const dateStrings = availObj.dates.filter(
              (date: unknown): date is string => typeof date === 'string'
            );
            processedVenue.availability.dates = dateStrings;
          }
        }
        
        processedVenues.push(processedVenue);
      }
    }
    
    // Apply date filter if specified
    if (filters.availabilityDate && processedVenues.length > 0) {
      const dateString = filters.availabilityDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      return processedVenues.filter(venue => {
        // Venue is available if the date is not in the unavailable dates array
        return !venue.availability?.dates.includes(dateString);
      });
    }
    
    return processedVenues;
  };
  
  return useQuery({
    queryKey: ["venues", filters],
    queryFn: fetchVenues,
  });
};
