
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface CapacityFilterProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CapacityFilter: React.FC<CapacityFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="minCapacity" className="mb-1.5 block">Capacity</Label>
      <div className="relative">
        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          id="minCapacity"
          type="number"
          placeholder="Min capacity"
          value={value}
          onChange={onChange}
          className="pl-9"
        />
      </div>
    </div>
  );
};
