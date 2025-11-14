
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid, List, ArrowUpDown } from "lucide-react";

interface ILEAResultsHeaderProps {
  activeTab: string;
  selectedCity: string;
  resultCount: number;
  isLoading: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export const ILEAResultsHeader: React.FC<ILEAResultsHeaderProps> = ({
  activeTab,
  selectedCity,
  resultCount,
  isLoading,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {isLoading ? "Loading..." : (
              <>
                {resultCount} {activeTab === "venues" ? "Venues" : "Vendors"}
                {selectedCity && selectedCity !== "all" && (
                  <span className="text-gray-500 font-normal"> in {selectedCity}</span>
                )}
              </>
            )}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                {activeTab === "venues" && (
                  <>
                    <SelectItem value="capacity">Capacity</SelectItem>
                    <SelectItem value="capacity_desc">Capacity (Desc)</SelectItem>
                  </>
                )}
                {activeTab === "vendors" && (
                  <>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
