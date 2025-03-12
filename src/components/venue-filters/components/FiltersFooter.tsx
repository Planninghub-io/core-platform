
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FiltersFooterProps {
  onApply: () => void;
}

export const FiltersFooter: React.FC<FiltersFooterProps> = ({ onApply }) => {
  return (
    <div className="mt-4">
      <Button 
        onClick={onApply}
        className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 w-full"
      >
        Search
      </Button>
    </div>
  );
};
