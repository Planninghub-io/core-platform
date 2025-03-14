
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATES } from "../constants";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  cityValue: string;
  stateValue: string;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ 
  cityValue, 
  stateValue, 
  onCityChange, 
  onStateChange 
}) => {
  return (
    <div className="flex gap-2 items-end">
      <div>
        <Label htmlFor="city" className="mb-1.5 block">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="city"
            placeholder="City"
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
            className="pl-9 w-32"
          />
        </div>
      </div>
      <div>
        <Select value={stateValue} onValueChange={onStateChange}>
          <SelectTrigger id="state" className="w-32">
            <SelectValue placeholder="State" />
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
    </div>
  );
};
