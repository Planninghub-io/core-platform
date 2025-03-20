import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { FlexibleLocationCheckbox } from "../../FlexibleLocationCheckbox";

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
      const parsedLocation = parseLocation(location);
      setCityState(parsedLocation);
    }
  }, [location]);

  const parseLocation = (locationString: string): { city: string; state: string } => {
    let cleaned = locationString.replace(/^(at|in)\s+/i, '');
    
    const commaPattern = /([^,]+),\s*([^,]+)(?:,\s*([^,]+))?$/;
    const commaMatch = cleaned.match(commaPattern);
    
    if (commaMatch) {
      if (commaMatch[3]) {
        return { city: commaMatch[2].trim(), state: commaMatch[3].trim() };
      }
      return { city: commaMatch[1].trim(), state: commaMatch[2].trim() };
    }
    
    const inPattern = /(.+)\s+in\s+([^,]+)(?:,\s*([^,]+))?/i;
    const inMatch = cleaned.match(inPattern);
    
    if (inMatch) {
      return { 
        city: inMatch[2].trim(), 
        state: inMatch[3] ? inMatch[3].trim() : '' 
      };
    }
    
    const cityStatePattern = /([A-Za-z\s]+)[\s,]+([A-Z]{2})\b/;
    const cityStateMatch = cleaned.match(cityStatePattern);
    
    if (cityStateMatch) {
      return { city: cityStateMatch[1].trim(), state: cityStateMatch[2] };
    }
    
    const words = cleaned.split(/\s+/);
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (/^[A-Z][a-z]+$/.test(lastWord)) {
        return { city: lastWord, state: '' };
      }
      return { city: cleaned, state: '' };
    }
    
    return { city: '', state: '' };
  };

  const handleFlexibleLocationChange = (checked: boolean) => {
    setIsFlexibleLocation(checked);
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
        onChange={(e) => setLocation(e.target.value)}
        placeholder={isFlexibleLocation ? "Enter preferred locations" : "Enter venue or location"}
        className={hasMissingLocation ? "border-red-300 focus:border-red-500" : ""}
      />
      
      {hasMissingLocation && !location && (
        <p className="text-sm text-red-500">Location is required</p>
      )}
      
      {cityState.city && cityState.state && (
        <div className="text-sm text-gray-500 mt-1">
          Detected: {cityState.city}, {cityState.state}
        </div>
      )}
    </div>
  );
};
