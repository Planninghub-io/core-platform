
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";

export const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social Gathering" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "other", label: "Other" }
];

interface VenueSearchFormProps {
  location: string;
  setLocation: (location: string) => void;
  eventType: string;
  setEventType: (eventType: string) => void;
  preferredFeatures: string;
  setPreferredFeatures: (features: string) => void;
  onSearch: () => Promise<void>;
  isLoading: boolean;
}

export const VenueSearchForm: React.FC<VenueSearchFormProps> = ({
  location,
  setLocation,
  eventType,
  setEventType,
  preferredFeatures,
  setPreferredFeatures,
  onSearch,
  isLoading
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Find Venue Recommendations</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your event, and our AI will recommend the perfect venues for you.
      </p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="location"
              placeholder="City, state or region"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={eventType}
            onValueChange={setEventType}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="features">Preferred Features (Optional)</Label>
          <Input
            id="features"
            placeholder="e.g., outdoor space, catering"
            value={preferredFeatures}
            onChange={(e) => setPreferredFeatures(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <Button
        onClick={onSearch}
        disabled={isLoading}
        className="mt-6 bg-[#8b73f4] hover:bg-[#8b73f4]/90 gap-2"
      >
        <Search className="h-4 w-4" />
        {isLoading ? "Searching..." : "Find Recommendations"}
      </Button>
    </div>
  );
};
