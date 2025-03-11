
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface CityFilterProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CityFilter: React.FC<CityFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="city">City</Label>
      <div className="relative mt-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          id="city"
          placeholder="e.g. Austin"
          value={value}
          onChange={onChange}
          className="pl-9"
        />
      </div>
    </div>
  );
};
