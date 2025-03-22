
import React from "react";
import { FilterX } from "lucide-react";

export const NoMatchingItems: React.FC = () => {
  return (
    <div className="text-center py-8">
      <FilterX className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No matching items</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try changing your filter or generate more items.
      </p>
    </div>
  );
};
