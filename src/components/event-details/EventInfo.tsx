
import { FormField } from "./components/FormField";
import { DateTimeField } from "./components/DateTimeField";
import { DeleteEventDialog } from "./components/DeleteEventDialog";
import { formatDateOnly, formatTimeOnly, combineDateTime } from "./utils/dateUtils";
import { Event } from "./types/event";

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

      <div className="grid gap-4">
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
          placeholder="No category specified"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('category', value)}
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
