
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventTypeFieldsProps {
  eventType: string;
  venueType: string;
  handleSelectChange: (field: string, value: any) => void;
}

// Event type options
const EVENT_TYPES = [
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

// Venue type options
const VENUE_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "restaurant", label: "Restaurant" },
  { value: "outdoors", label: "Outdoors" },
  { value: "banquet_hall", label: "Banquet Hall" },
  { value: "conference_center", label: "Conference Center" },
  { value: "gallery", label: "Gallery/Museum" },
  { value: "garden", label: "Garden/Park" },
  { value: "beach", label: "Beach" },
  { value: "private_residence", label: "Private Residence" },
  { value: "other", label: "Other" }
];

export const EventTypeFields = ({
  eventType,
  venueType,
  handleSelectChange
}: EventTypeFieldsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="eventType">Event Type</Label>
        <Select
          value={eventType}
          onValueChange={(value) => handleSelectChange('eventType', value)}
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <Label htmlFor="venueType">Venue Type</Label>
        <Select
          value={venueType}
          onValueChange={(value) => handleSelectChange('venueType', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select venue type" />
          </SelectTrigger>
          <SelectContent>
            {VENUE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
