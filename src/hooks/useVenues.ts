
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  zipcode?: string;
  state: string;
  type: string;
  capacity: number;
  price_range: string;
  features: string[];
  images: string[];
  rating: number;
  verified?: boolean;
  indoor_space_sqft?: number;
  outdoor_space_sqft?: number;
  booking_policy?: string;
  cancellation_policy?: string;
  amenities?: Record<string, boolean>;
  availability?: {
    dates?: string[];
  };
  source?: 'database' | 'web';
}

export interface Filter {
  city?: string;
  zipcode?: string;
  state?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  date?: string;
}

export interface VenueFilterValues {
  city?: string;
  zipcode?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  availabilityDate?: Date;
  verifiedOnly?: boolean;
}

export interface VenueRecommendation {
  venueId: string;
  matchScore: number;
  reason: string;
  specialConsiderations: string;
  venue: Venue | null;
}

const fetchVenues = async (filters: VenueFilterValues = {}): Promise<Venue[]> => {
  console.log("Fetching venues with filters:", filters);
  
  let query = supabase
    .from("venues")
    .select("*");
  
  // Apply city filter if provided
  if (filters.city && filters.city !== "all") {
    query = query.eq("city", filters.city);
  }
  
  // Apply zipcode filter if provided
  if (filters.zipcode) {
    query = query.eq("zipcode", filters.zipcode);
  }
  
  // Apply capacity filter if provided
  if (filters.capacity?.min) {
    query = query.gte("capacity", filters.capacity.min);
  }
  
  if (filters.capacity?.max) {
    query = query.lte("capacity", filters.capacity.max);
  }
  
  // Apply verified filter if provided
  if (filters.verifiedOnly) {
    query = query.eq("verified", true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching venues:", error);
    throw new Error(`Failed to fetch venues: ${error.message}`);
  }
  
  console.log("Fetched venues data:", data);
  
  // Transform the data to ensure it matches our interface
  const transformedData = (data || []).map(venue => ({
    ...venue,
    features: Array.isArray(venue.features) ? venue.features : [],
    images: Array.isArray(venue.images) ? venue.images : [],
    rating: venue.rating || 0,
    price_range: venue.price_range || "Contact for pricing",
    description: venue.description || "",
    location: venue.location || venue.city || "",
    state: venue.state || "TX",
    type: venue.type || "Event Venue"
  }));
  
  return transformedData;
};

export const useVenues = (filters: VenueFilterValues = {}) => {
  return useQuery({
    queryKey: ["venues", filters],
    queryFn: () => fetchVenues(filters),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Legacy compatibility functions for components that might still use the old pattern
export const useVenuesLegacy = (filters: VenueFilterValues = {}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVenues = async (filterValues: VenueFilterValues = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchVenues({...filters, ...filterValues});
      setVenues(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch venues";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async (venueId: string, date: string) => {
    // For now, return true - this can be enhanced later
    return true;
  };

  // Initial fetch on mount or when filters change
  const fetchVenuesLegacy = async () => {
    return getVenues(filters);
  };

  return { 
    venues, 
    isLoading, 
    error, 
    getVenues, 
    checkAvailability,
    // Add these for compatibility with react-query expectations in Venues.tsx
    data: venues,
    refetch: fetchVenuesLegacy
  };
};
