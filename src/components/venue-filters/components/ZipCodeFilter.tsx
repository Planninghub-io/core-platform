
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinned } from "lucide-react";

interface ZipCodeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ZipCodeFilter: React.FC<ZipCodeFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="zipcode" className="mb-1.5 block">Zip Code</Label>
      <div className="relative">
        <MapPinned className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          id="zipcode"
          placeholder="e.g. 78664"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
          maxLength={10}
          pattern="[0-9]*"
        />
      </div>
    </div>
  );
};
