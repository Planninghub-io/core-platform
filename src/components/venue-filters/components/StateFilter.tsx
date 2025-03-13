
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATES } from "../constants";

interface StateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const StateFilter: React.FC<StateFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="state" className="mb-1.5 block">State</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="state">
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
  );
};
