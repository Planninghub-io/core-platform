
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Venue {
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
  availability?: {
    dates?: string[];
  };
}

interface Filter {
  city?: string;
  state?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  date?: string;
}

export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVenues = async (filters: Filter = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("venue-availability", {
        body: { filters },
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
      setError(err.message);
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

  return { venues, isLoading, error, getVenues, checkAvailability };
};
