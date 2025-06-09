
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { getTimezoneFromLocation } from "../../utils/timezoneUtils";
import { useEffect } from "react";

interface LocationFieldProps {
  location: string;
  preferredLocations: string;
  isFlexibleLocation: boolean;
  timezone: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: string) => void;
}

export const LocationField = ({
  location,
  preferredLocations,
  isFlexibleLocation,
  timezone,
  handleChange,
  handleCheckboxChange,
  handleSelectChange
}: LocationFieldProps) => {
  
  // Auto-update timezone when location changes
  useEffect(() => {
    if (location && !isFlexibleLocation) {
      const detectedTimezone = getTimezoneFromLocation(location);
      if (detectedTimezone !== timezone) {
        handleSelectChange('timezone', detectedTimezone);
      }
    }
  }, [location, isFlexibleLocation, timezone, handleSelectChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="location">Event Location *</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="flexibleLocation" 
            checked={isFlexibleLocation}
            onCheckedChange={(checked) => handleCheckboxChange('isFlexibleLocation', checked === true)}
          />
          <Label htmlFor="flexibleLocation" className="cursor-pointer text-sm">Is flexible</Label>
        </div>
      </div>
      
      {isFlexibleLocation ? (
        <Textarea
          id="preferredLocations"
          name="preferredLocations"
          value={preferredLocations}
          onChange={handleChange}
          placeholder="Select preferred locations (limit to 4 cities)"
          className="min-h-[80px]"
        />
      ) : (
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="location"
            name="location"
            value={location}
            onChange={handleChange}
            placeholder="Enter event location"
            className="pl-10"
            required={!isFlexibleLocation}
          />
        </div>
      )}
    </div>
  );
};
