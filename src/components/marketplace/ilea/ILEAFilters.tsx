
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CitySelector } from "@/components/venue-filters/components/CitySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, X } from "lucide-react";

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

  const hasActiveFilters = selectedCity && selectedCity !== "" && selectedCity !== "all";

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Active Filters
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCity && selectedCity !== "" && selectedCity !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedCity}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => onCityChange("")}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Location Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Location</Label>
        <CitySelector 
          selectedCity={selectedCity} 
          onCitySelect={onCityChange}
          type={activeTab === "vendors" ? "vendors" : "venues"}
        />
      </div>

      <Separator />

      {/* Sort Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sort by</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
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

      {/* Help Text */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <h4 className="font-medium text-purple-900 mb-2">
          About ILEA {activeTab === "venues" ? "Venues" : "Vendors"}
        </h4>
        <p className="text-sm text-purple-700">
          {activeTab === "venues" 
            ? "Discover premium event venues from verified ILEA members. All venues meet professional industry standards."
            : "Connect with trusted event vendors from the ILEA network. All vendors are verified industry professionals."
          }
        </p>
      </div>
    </div>
  );
};
