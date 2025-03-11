
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FiltersFooterProps {
  onApply: () => void;
}

export const FiltersFooter: React.FC<FiltersFooterProps> = ({ onApply }) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button 
        onClick={onApply}
        className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 gap-2"
      >
        <Search className="h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
};
