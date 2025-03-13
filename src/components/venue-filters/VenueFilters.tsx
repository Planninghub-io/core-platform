import React, { useState, useCallback } from "react";
import { CityFilter } from "./components/CityFilter";
import { StateFilter } from "./components/StateFilter";
import { CapacityFilter } from "./components/CapacityFilter";
import { FiltersHeader } from "./components/FiltersHeader";
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
  
  const handleCityChange = useCallback((city: string) => {
    setCity(city);
  }, []);

  const handleStateChange = useCallback((state: string) => {
    setState(state);
  }, []);

  const handleMinCapacityChange = useCallback((min: number) => {
    setMinCapacity(min);
  }, []);

  const handleMaxCapacityChange = useCallback((max: number) => {
    setMaxCapacity(max);
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
      <FiltersHeader onReset={handleResetFilters} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <CityFilter city={city} onChange={handleCityChange} />
        <StateFilter state={state} onChange={handleStateChange} />
        <CapacityFilter 
          minCapacity={minCapacity} 
          maxCapacity={maxCapacity} 
          onMinChange={handleMinCapacityChange}
          onMaxChange={handleMaxCapacityChange}
        />
        <AvailabilityFilter 
          availabilityDate={availabilityDate}
          onChange={handleAvailabilityChange}
          onClear={handleAvailabilityClear}
        />
      </div>
      
      <FiltersFooter onApply={handleApplyFilters} />
    </div>
  );
};

export default VenueFilters;
