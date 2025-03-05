
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FlexibleLocationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const FlexibleLocationCheckbox: React.FC<FlexibleLocationCheckboxProps> = ({ 
  checked, 
  onChange 
}) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Checkbox 
        id="flexible-location" 
        checked={checked} 
        onCheckedChange={onChange}
      />
      <Label 
        htmlFor="flexible-location" 
        className="cursor-pointer text-sm text-gray-600"
      >
        Location is flexible
      </Label>
    </div>
  );
};
