
import React, { useState, useCallback } from "react";
import { LocationFilter } from "./components/LocationFilter";
import { CapacityFilter } from "./components/CapacityFilter";
import { FiltersFooter } from "./components/FiltersFooter";
import { AvailabilityFilter } from "./components/AvailabilityFilter";
import { VenueFilterValues } from "@/hooks/useVenues";

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFilterValues) => void;
}

const VenueFilters = ({ onFilterChange }: VenueFiltersProps) => {
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [maxCapacity, setMaxCapacity] = useState<number | undefined>(undefined);
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined);
  
  const handleCityChange = useCallback((value: string) => {
    setCity(value);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setState(value);
  }, []);

  const handleMinCapacityChange = useCallback((value: string) => {
    const minValue = value ? parseInt(value, 10) : undefined;
    setMinCapacity(minValue);
  }, []);

  const handleMaxCapacityChange = useCallback((value: string) => {
    const maxValue = value ? parseInt(value, 10) : undefined;
    setMaxCapacity(maxValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setCity("");
    setState("");
    setMinCapacity(undefined);
    setMaxCapacity(undefined);
    setAvailabilityDate(undefined);
    
    const filters: VenueFilterValues = {
      city: undefined,
      state: undefined,
      capacity: {
        min: undefined,
        max: undefined
      },
      availabilityDate: undefined
    };
    onFilterChange(filters);
  }, [onFilterChange]);

  const handleApplyFilters = useCallback(() => {
    const filters: VenueFilterValues = {
      city: city || undefined,
      state: state || undefined,
      capacity: {
        min: minCapacity,
        max: maxCapacity
      },
      availabilityDate: availabilityDate
    };

    onFilterChange(filters);
  }, [city, state, minCapacity, maxCapacity, availabilityDate, onFilterChange]);

  const handleAvailabilityChange = (date: Date) => {
    setAvailabilityDate(date);
    
    // Update filters when date changes
    setTimeout(() => {
      handleApplyFilters();
    }, 0);
  };
  
  const handleAvailabilityClear = () => {
    setAvailabilityDate(undefined);
    
    // Update filters when date is cleared
    setTimeout(() => {
      handleApplyFilters();
    }, 0);
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <LocationFilter 
          cityValue={city} 
          stateValue={state} 
          onCityChange={handleCityChange}
          onStateChange={handleStateChange}
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
          <button
            onClick={handleApplyFilters}
            className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 text-white px-4 py-2 rounded-md text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;
