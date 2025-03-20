
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { FlexibleLocationCheckbox } from "../../FlexibleLocationCheckbox";
import { parseLocationComponents } from "@/hooks/event-generation/utils/prompt-extraction/locationExtractor/extractor";

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
  const [isFlexibleLocation, setIsFlexibleLocation] = useState(false);
  const [cityState, setCityState] = useState<{ city: string; state: string }>({ 
    city: '', 
    state: '' 
  });

  useEffect(() => {
    if (location) {
      // Use the enhanced location parser
      const parsedLocation = parseLocationComponents(location);
      setCityState(parsedLocation);
    }
  }, [location]);

  const handleFlexibleLocationChange = (checked: boolean) => {
    setIsFlexibleLocation(checked);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    
    // Parse location as user types
    if (newLocation) {
      const parsedLocation = parseLocationComponents(newLocation);
      setCityState(parsedLocation);
    } else {
      setCityState({ city: '', state: '' });
    }
  };

  const displayLocation = cityState.state 
    ? `${cityState.city}, ${cityState.state}` 
    : cityState.city || location;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Label htmlFor="location">Location</Label>
        </div>
        
        <FlexibleLocationCheckbox 
          checked={isFlexibleLocation} 
          onChange={handleFlexibleLocationChange}
        />
      </div>
      
      <Input
        id="location"
        value={location}
        onChange={handleLocationChange}
        placeholder={isFlexibleLocation ? "Enter preferred locations" : "Enter venue or location"}
        className={hasMissingLocation ? "border-red-300 focus:border-red-500" : ""}
      />
      
      {hasMissingLocation && !location && (
        <p className="text-sm text-red-500">Location is required</p>
      )}
      
      {cityState.city && (
        <div className="text-sm text-gray-500 mt-1">
          {cityState.state 
            ? `Detected: ${cityState.city}, ${cityState.state}` 
            : `Detected: ${cityState.city}`}
        </div>
      )}
    </div>
  );
};
