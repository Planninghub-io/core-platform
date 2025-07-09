
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";

interface CitySelectorProps {
  onCitySelect: (city: string) => void;
  selectedCity: string;
  type?: 'venues' | 'vendors';
}

export const CitySelector = ({ onCitySelect, selectedCity, type = 'venues' }: CitySelectorProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch cities directly from the database based on type
        let query;
        if (type === 'vendors') {
          query = supabase
            .from('vendor_services')
            .select('city')
            .not('city', 'is', null);
        } else {
          query = supabase
            .from('venues')
            .select('city')
            .not('city', 'is', null);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Extract unique cities from the data
        const uniqueCities = [...new Set(data?.map(item => item.city).filter(Boolean))] as string[];
        setCities(uniqueCities.sort());
      } catch (err: any) {
        console.error("Failed to fetch cities:", err);
        setError(err.message || "Failed to load cities");
        // Fallback to common cities if the query fails
        setCities(['Austin', 'Dallas', 'Houston', 'San Antonio']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [type]);

  return (
    <div>
      <Label htmlFor="city-select" className="mb-1.5 block">City</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 z-10" />
        <Select value={selectedCity} onValueChange={onCitySelect} disabled={isLoading}>
          <SelectTrigger id="city-select" className="pl-9">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
