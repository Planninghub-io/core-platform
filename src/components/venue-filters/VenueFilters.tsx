
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
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <CityFilter 
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        
        <div className="flex-1">
          <StateFilter
            value={state}
            onChange={setState}
          />
        </div>
        
        <div className="flex-1">
          <CapacityFilter
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
          />
        </div>
        
        <div className="mt-0">
          <FiltersFooter onApply={handleApplyFilters} />
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;
