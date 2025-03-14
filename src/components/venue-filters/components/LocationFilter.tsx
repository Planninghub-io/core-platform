
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  cityValue: string;
  onCityChange: (value: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ 
  cityValue, 
  onCityChange 
}) => {
  return (
    <div>
      <Label htmlFor="city" className="mb-1.5 block">Location</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          id="city"
          placeholder="City"
          value={cityValue}
          onChange={(e) => onCityChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
    </div>
  );
};
