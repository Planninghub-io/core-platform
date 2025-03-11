
import React, { useState } from "react";
import { CityFilter } from "./components/CityFilter";
import { StateFilter } from "./components/StateFilter";
import { CapacityFilter } from "./components/CapacityFilter";
import { FiltersHeader } from "./components/FiltersHeader";
import { FiltersFooter } from "./components/FiltersFooter";

export type VenueFilterValues = {
  city?: string;
  state?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
};

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFilterValues) => void;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({ onFilterChange }) => {
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("Texas");
  const [minCapacity, setMinCapacity] = useState<string>("");
  
  const handleApplyFilters = () => {
    const filters: VenueFilterValues = {
      city: city || undefined,
      state: state || undefined,
      capacity: {
        min: minCapacity ? parseInt(minCapacity, 10) : undefined
      }
    };
    
    onFilterChange(filters);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
      <FiltersHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CityFilter 
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <StateFilter
          value={state}
          onChange={setState}
        />
        
        <CapacityFilter
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
        />
      </div>
      
      <FiltersFooter onApply={handleApplyFilters} />
    </div>
  );
};

export default VenueFilters;
