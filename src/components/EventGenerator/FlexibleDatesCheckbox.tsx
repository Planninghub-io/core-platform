
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FlexibleDatesCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const FlexibleDatesCheckbox: React.FC<FlexibleDatesCheckboxProps> = ({ 
  checked, 
  onChange 
}) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Checkbox 
        id="flexible-dates" 
        checked={checked} 
        onCheckedChange={onChange}
      />
      <Label 
        htmlFor="flexible-dates" 
        className="cursor-pointer text-sm text-gray-600"
      >
        Dates are flexible
      </Label>
    </div>
  );
};
