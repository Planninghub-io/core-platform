import React, { useState, useCallback, useEffect } from "react";
import { CapacityFilter } from "./components/CapacityFilter";
import { AvailabilityFilter } from "./components/AvailabilityFilter";
import { VenueFilterValues } from "@/hooks/useVenues";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { CitySelector } from "./components/CitySelector";
import { ZipCodeFilter } from "./components/ZipCodeFilter";

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFilterValues) => void;
}

const VenueFilters = ({ onFilterChange }: VenueFiltersProps) => {
  const [city, setCity] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  
  // Apply filters automatically whenever a filter value changes
  useEffect(() => {
    const filters: VenueFilterValues = {
      city: city && city !== "all" ? city : undefined,
      zipcode: zipcode || undefined,
      capacity: {
        min: minCapacity,
        max: undefined
      },
      availabilityDate: availabilityDate,
      verifiedOnly: verifiedOnly
    };

    onFilterChange(filters);
  }, [city, zipcode, minCapacity, availabilityDate, verifiedOnly, onFilterChange]);

  const handleCityChange = useCallback((value: string) => {
    setCity(value);
  }, []);

  const handleZipcodeChange = useCallback((value: string) => {
    setZipcode(value);
  }, []);

  const handleMinCapacityChange = useCallback((value: string) => {
    const minValue = value ? parseInt(value, 10) : undefined;
    setMinCapacity(minValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setCity("");
    setZipcode("");
    setMinCapacity(undefined);
    setAvailabilityDate(undefined);
    setVerifiedOnly(false);
  }, []);

  const handleAvailabilityChange = (date: Date) => {
    setAvailabilityDate(date);
  };
  
  const handleAvailabilityClear = () => {
    setAvailabilityDate(undefined);
  };

  const handleVerifiedChange = (checked: boolean) => {
    setVerifiedOnly(checked);
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <CitySelector 
          selectedCity={city} 
          onCitySelect={handleCityChange}
          type="venues" 
        />
        
        <ZipCodeFilter
          value={zipcode}
          onChange={handleZipcodeChange}
        />
        
        <CapacityFilter 
          value={minCapacity?.toString() || ''} 
          onChange={handleMinCapacityChange}
        />
        
        <AvailabilityFilter 
          availabilityDate={availabilityDate}
          onChange={handleAvailabilityChange}
          onClear={handleAvailabilityClear}
        />
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="verified-only" 
            checked={verifiedOnly}
            onCheckedChange={handleVerifiedChange}
          />
          <Label htmlFor="verified-only" className="cursor-pointer flex items-center gap-1">
            <span>Verified Only</span>
            {verifiedOnly && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </Label>
        </div>
        
        <div className="ml-auto">
          <button 
            onClick={handleResetFilters}
            className="text-sm text-gray-500 mr-2 hover:text-gray-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;
