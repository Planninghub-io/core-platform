
import React from "react";
import { Label } from "@/components/ui/label";
import { DateSelector } from "@/pages/create-event/components/form/DateSelector";

interface AvailabilityFilterProps {
  availabilityDate: Date | undefined;
  onChange: (date: Date) => void;
  onClear: () => void;
}

export const AvailabilityFilter: React.FC<AvailabilityFilterProps> = ({
  availabilityDate,
  onChange,
  onClear
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Available On</Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DateSelector
            date={availabilityDate || ""}
            onSelect={onChange}
            placeholder="Select a date"
          />
        </div>
        {availabilityDate && (
          <button 
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Shows venues available on this specific date
      </p>
    </div>
  );
};
