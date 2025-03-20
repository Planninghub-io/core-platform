
import { FormField } from "./components/FormField";
import { DateTimeField } from "./components/DateTimeField";
import { DeleteEventDialog } from "./components/DeleteEventDialog";
import { formatDateOnly, formatTimeOnly, combineDateTime } from "./utils/dateUtils";
import { Event } from "./types/event";
import { formatCurrency } from "@/utils/priceUtils";

// Define event category options
const EVENT_CATEGORIES = [
  { value: "wedding", label: "Wedding" },
  { value: "social_gathering", label: "Social Gathering" },
  { value: "corporate", label: "Corporate Event" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },
  { value: "birthday", label: "Birthday Party" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "concert", label: "Concert" },
  { value: "exhibition", label: "Exhibition" },
  { value: "other", label: "Other" }
];

interface EventInfoProps {
  event: Event;
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number) => void;
  onDelete?: () => void;
}

export const EventInfo = ({
  event,
  isEditing,
  onFieldChange,
  onDelete,
}: EventInfoProps) => {
  const handleDateTimeChange = (field: 'date' | 'end_date', type: 'date' | 'time', value: string) => {
    const currentValue = field === 'date' ? event.date : event.end_date;
    const newDateTime = type === 'date'
      ? combineDateTime(value, formatTimeOnly(currentValue), currentValue)
      : combineDateTime(formatDateOnly(currentValue), value, currentValue);
    
    onFieldChange(field, newDateTime);
  };

  return (
    <div className="space-y-6">
      <FormField
        id="title"
        label="Event Title"
        value={event.title}
        placeholder="No title"
        isEditing={isEditing}
        onChange={(value) => onFieldChange('title', value)}
      />

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <DateTimeField
            id="start"
            label="Start Date & Time"
            dateValue={formatDateOnly(event.date)}
            timeValue={formatTimeOnly(event.date)}
            isEditing={isEditing}
            onDateChange={(value) => handleDateTimeChange('date', 'date', value)}
            onTimeChange={(value) => handleDateTimeChange('date', 'time', value)}
          />
          
          <DateTimeField
            id="end"
            label="End Date & Time"
            dateValue={formatDateOnly(event.end_date)}
            timeValue={formatTimeOnly(event.end_date)}
            isEditing={isEditing}
            onDateChange={(value) => handleDateTimeChange('end_date', 'date', value)}
            onTimeChange={(value) => handleDateTimeChange('end_date', 'time', value)}
          />
        </div>
      </div>

      <FormField
        id="location"
        label="Location"
        value={event.location}
        placeholder="No location specified"
        isEditing={isEditing}
        onChange={(value) => onFieldChange('location', value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="category"
          label="Category"
          value={event.category}
          placeholder="Select a category"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('category', value)}
          type={isEditing ? "select" : "text"}
          options={EVENT_CATEGORIES}
        />

        <FormField
          id="expected_attendees"
          label="Expected Attendees"
          value={event.expected_attendees}
          placeholder="No attendees specified"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('expected_attendees', value)}
          type="number"
        />
      </div>
      
      {/* Add Budget Field */}
      <FormField
        id="budget"
        label="Expected Budget"
        value={event.budget ? formatCurrency(event.budget) : event.estimated_budget}
        placeholder="No budget specified"
        isEditing={isEditing}
        onChange={(value) => {
          // Remove currency symbol and commas before saving
          const numericValue = value.toString().replace(/[$,]/g, '');
          onFieldChange('budget', numericValue);
        }}
        type="text"
        prefix="$"
      />

      <FormField
        id="description"
        label="Description"
        value={event.description}
        placeholder="No description provided"
        isEditing={isEditing}
        onChange={(value) => onFieldChange('description', value)}
        type="textarea"
      />

      {isEditing && onDelete && event.status !== 'completed' && (
        <DeleteEventDialog onDelete={onDelete} />
      )}
    </div>
  );
};
