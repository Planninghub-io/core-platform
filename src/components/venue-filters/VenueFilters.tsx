
import React, { useState, useCallback, useEffect } from "react";
import { LocationFilter } from "./components/LocationFilter";
import { CapacityFilter } from "./components/CapacityFilter";
import { AvailabilityFilter } from "./components/AvailabilityFilter";
import { VenueFilterValues } from "@/hooks/useVenues";

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFilterValues) => void;
}

const VenueFilters = ({ onFilterChange }: VenueFiltersProps) => {
  const [city, setCity] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined);
  
  // Apply filters automatically whenever a filter value changes
  useEffect(() => {
    const filters: VenueFilterValues = {
      city: city || undefined,
      capacity: {
        min: minCapacity,
        max: undefined
      },
      availabilityDate: availabilityDate
    };

    onFilterChange(filters);
  }, [city, minCapacity, availabilityDate, onFilterChange]);

  const handleCityChange = useCallback((value: string) => {
    setCity(value);
  }, []);

  const handleMinCapacityChange = useCallback((value: string) => {
    const minValue = value ? parseInt(value, 10) : undefined;
    setMinCapacity(minValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setCity("");
    setMinCapacity(undefined);
    setAvailabilityDate(undefined);
  }, []);

  const handleAvailabilityChange = (date: Date) => {
    setAvailabilityDate(date);
  };
  
  const handleAvailabilityClear = () => {
    setAvailabilityDate(undefined);
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <LocationFilter 
          cityValue={city} 
          onCityChange={handleCityChange}
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
