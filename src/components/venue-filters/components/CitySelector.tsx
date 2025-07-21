
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
        console.log(`Fetching cities for type: ${type}`);
        
        // Always start with fallback cities to ensure dropdown works
        const fallbackCities = ['Austin', 'Dallas', 'Houston', 'San Antonio'];
        
        // Fetch cities directly from the database based on type
        let query;
        if (type === 'vendors') {
          query = supabase
            .from('vendor_services')
            .select('city')
            .not('city', 'is', null)
            .not('city', 'eq', '');
        } else {
          query = supabase
            .from('venues')
            .select('city')
            .not('city', 'is', null)
            .not('city', 'eq', '');
        }

        console.log('Executing query...');
        const { data, error } = await query;
        
        console.log('Query result:', { data, error });

        if (error) {
          console.error('Database error:', error);
          // Use fallback cities if query fails
          setCities(fallbackCities.sort());
        } else {
          // Extract unique cities from the data
          const uniqueCities = [...new Set(data?.map(item => item.city).filter(Boolean))] as string[];
          console.log('Unique cities found:', uniqueCities);
          
          // If no cities found in database, use fallback
          if (uniqueCities.length === 0) {
            console.log('No cities found in database, using fallback cities');
            setCities(fallbackCities.sort());
          } else {
            // Combine database cities with fallback cities and remove duplicates
            const allCities = [...new Set([...uniqueCities, ...fallbackCities])];
            setCities(allCities.sort());
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch cities:", err);
        setError(err.message || "Failed to load cities");
        // Always fallback to Texas cities if everything fails
        setCities(['Austin', 'Dallas', 'Houston', 'San Antonio'].sort());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [type]);

  const handleCityChange = (value: string) => {
    console.log('City selected:', value);
    // Convert "all" back to empty string for the parent component
    onCitySelect(value === "all" ? "" : value);
  };

  // Convert empty string to "all" for the Select component
  const selectValue = selectedCity === "" ? "all" : selectedCity;

  console.log('CitySelector render:', { 
    cities: cities.length, 
    selectedCity, 
    selectValue,
    isLoading 
  });

  return (
    <div>
      <Label htmlFor="city-select" className="mb-1.5 block">City</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 z-10" />
        <Select value={selectValue} onValueChange={handleCityChange} disabled={isLoading}>
          <SelectTrigger id="city-select" className="pl-9">
            <SelectValue placeholder={isLoading ? "Loading cities..." : "Select a city"} />
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
