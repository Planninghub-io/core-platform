
import React from "react";
import { Filter } from "lucide-react";

export const FiltersHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-4">
      <Filter className="h-5 w-5 text-[#8b73f4] mr-2" />
      <h3 className="text-lg font-medium">Filter Venues</h3>
    </div>
  );
};
