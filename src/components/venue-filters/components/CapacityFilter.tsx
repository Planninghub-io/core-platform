
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CapacityFilterProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CapacityFilter: React.FC<CapacityFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="minCapacity">Minimum Capacity</Label>
      <Input
        id="minCapacity"
        type="number"
        placeholder="Min capacity"
        value={value}
        onChange={onChange}
        className="mt-1"
      />
    </div>
  );
};
