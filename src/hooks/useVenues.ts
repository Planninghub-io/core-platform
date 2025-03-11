
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
};

export type VenueFilterValues = {
  city?: string;
  state?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
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
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ["venues", filters],
    queryFn: fetchVenues,
  });
};
