
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
  availability?: {
    dates: string[];
  };
};

export type VenueFilterValues = {
  city?: string;
  state?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  availabilityDate?: Date;
};

export const useVenues = (filters: VenueFilterValues) => {
  // Function to fetch venues with filters
  const fetchVenues = async (): Promise<Venue[]> => {
    let query = supabase.from("venues").select("*");
    
    // Apply filters
    if (filters.city) {
      // This is a basic implementation. In a real app, we'd need to extract city from address or have a city column
      query = query.ilike('name', `%${filters.city}%`);
    }
    
    if (filters.capacity?.min) {
      query = query.gte('capacity', filters.capacity.min);
    }
    
    // In the future, we could add filtering by state if that data was in the venues table
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching venues:", error);
      throw new Error("Failed to fetch venues");
    }
    
    // Process the venues to ensure they have the correct structure
    const processedVenues: Venue[] = (data || []).map(venue => {
      // Process availability data to ensure it has the expected structure
      let availabilityDates: string[] = [];
      
      if (venue.availability && typeof venue.availability === 'object') {
        // Try to safely extract dates from the availability object
        const availObj = venue.availability as any;
        if (availObj.dates && Array.isArray(availObj.dates)) {
          availabilityDates = availObj.dates;
        }
      }
      
      // Return a properly structured venue object
      return {
        ...venue,
        availability: {
          dates: availabilityDates
        }
      };
    });
    
    // If availability date filter is applied, filter venues that are available on that date
    let filteredVenues = processedVenues;
    
    if (filters.availabilityDate && filteredVenues.length > 0) {
      const dateString = filters.availabilityDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      filteredVenues = filteredVenues.filter(venue => {
        // Venue is available if the date is not in the unavailable dates array
        return !venue.availability?.dates.includes(dateString);
      });
    }
    
    return filteredVenues;
  };
  
  return useQuery({
    queryKey: ["venues", filters],
    queryFn: fetchVenues,
  });
};
