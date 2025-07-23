
import React from "react";
import { CitySelector } from "@/components/venue-filters/components/CitySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, X, SlidersHorizontal } from "lucide-react";

interface ILEAFiltersProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  activeTab: string;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export const ILEAFilters: React.FC<ILEAFiltersProps> = ({
  selectedCity,
  onCityChange,
  activeTab,
  sortBy,
  onSortChange
}) => {
  const handleClearFilters = () => {
    onCityChange("");
    onSortChange("name");
  };

  const hasActiveFilters = selectedCity && selectedCity !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 h-8 px-3"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Location</Label>
          <CitySelector 
            selectedCity={selectedCity} 
            onCitySelect={onCityChange}
            type={activeTab === "vendors" ? "vendors" : "venues"}
          />
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Sort by</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              <SelectItem value="name" className="rounded-lg">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc" className="rounded-lg">Name (Z-A)</SelectItem>
              {activeTab === "venues" && (
                <>
                  <SelectItem value="capacity" className="rounded-lg">Capacity (Low to High)</SelectItem>
                  <SelectItem value="capacity_desc" className="rounded-lg">Capacity (High to Low)</SelectItem>
                </>
              )}
              {activeTab === "vendors" && (
                <>
                  <SelectItem value="price" className="rounded-lg">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc" className="rounded-lg">Price (High to Low)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {selectedCity && selectedCity !== "" && (
              <Badge 
                variant="secondary" 
                className="flex items-center gap-2 bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 rounded-full"
              >
                <MapPin className="h-3 w-3" />
                {selectedCity}
                <button
                  onClick={() => onCityChange("")}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
        <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
          <span>About ILEA {activeTab === "venues" ? "Venues" : "Vendors"}</span>
        </h4>
        <p className="text-sm text-purple-700 leading-relaxed">
          {activeTab === "venues" 
            ? "Discover premium event venues from verified ILEA members. All venues meet professional industry standards and are trusted by event professionals worldwide."
            : "Connect with trusted event vendors from the ILEA network. All vendors are verified industry professionals with proven track records in event services."
          }
        </p>
      </div>
    </div>
  );
};
