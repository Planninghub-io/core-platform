
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Search } from "lucide-react";

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

export const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const VenueFilters: React.FC<VenueFiltersProps> = ({ onFilterChange }) => {
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("Texas"); // Default to Texas since we have Austin data
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
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-[#8b73f4] mr-2" />
        <h3 className="text-lg font-medium">Filter Venues</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="city"
              placeholder="e.g. Austin"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Select
            value={state}
            onValueChange={setState}
          >
            <SelectTrigger id="state" className="mt-1">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((stateName) => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="minCapacity">Minimum Capacity</Label>
          <Input
            id="minCapacity"
            type="number"
            placeholder="Min capacity"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={handleApplyFilters}
          className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 gap-2"
        >
          <Search className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default VenueFilters;
