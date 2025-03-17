
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
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
  state?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  date?: string;
}

export interface VenueFilterValues {
  city?: string;
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

export const useVenues = (filters: VenueFilterValues = {}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert the VenueFilterValues to the API Filter format
  const convertFilters = (filterValues: VenueFilterValues): Filter => {
    return {
      city: filterValues.city,
      minCapacity: filterValues.capacity?.min,
      maxCapacity: filterValues.capacity?.max,
      date: filterValues.availabilityDate ? filterValues.availabilityDate.toISOString().split('T')[0] : undefined
    };
  };

  const getVenues = async (filterValues: VenueFilterValues = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiFilters = convertFilters({...filters, ...filterValues});
      
      const { data, error } = await supabase.functions.invoke("venue-availability", {
        body: { filters: apiFilters },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Simplify how we handle availability data to avoid deep recursion
      const processedVenues = data.map((venue: any) => ({
        ...venue,
        availability: venue.availability ? {
          dates: Array.isArray(venue.availability.dates) ? venue.availability.dates : []
        } : undefined
      }));

      setVenues(processedVenues);
      return processedVenues;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch venues";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async (venueId: string, date: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("venue-availability", {
        body: { venueId, date },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.available;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Initial fetch on mount or when filters change
  const fetchVenues = async () => {
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
    refetch: fetchVenues
  };
};
