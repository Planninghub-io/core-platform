
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationSectionProps {
  location: string;
  setLocation: (location: string) => void;
  hasMissingLocation: boolean;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  setLocation,
  hasMissingLocation
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <Label htmlFor="location">Location</Label>
      </div>
      <Input
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter venue or location"
        className={hasMissingLocation ? "border-red-300 focus:border-red-500" : ""}
      />
      {hasMissingLocation && !location && (
        <p className="text-sm text-red-500">Location is required</p>
      )}
    </div>
  );
};
