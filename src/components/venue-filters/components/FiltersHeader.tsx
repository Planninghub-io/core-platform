
import React from "react";
import { Button } from "@/components/ui/button";

interface FiltersHeaderProps {
  onReset: () => void;
}

export const FiltersHeader: React.FC<FiltersHeaderProps> = ({ onReset }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">Filters</h2>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Reset All
      </Button>
    </div>
  );
};
