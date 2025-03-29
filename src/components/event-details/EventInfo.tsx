
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
  onEditField?: (fieldName: string) => void;
}

export const EventInfo = ({
  event,
  isEditing,
  onFieldChange,
  onDelete,
  onEditField,
}: EventInfoProps) => {
  
  const handleDateTimeChange = (field: 'date' | 'end_date', type: 'date' | 'time', value: string) => {
    const currentValue = field === 'date' ? event.date : event.end_date;
    const newDateTime = type === 'date'
      ? combineDateTime(value, formatTimeOnly(currentValue), currentValue)
      : combineDateTime(formatDateOnly(currentValue), value, currentValue);
    
    onFieldChange(field, newDateTime);
  };

  // Safely format the budget value
  const getBudgetValue = () => {
    if (event.budget) {
      return formatCurrency(event.budget);
    } else if (event.estimated_budget) {
      return event.estimated_budget;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <FormField
          id="title"
          label="Event Title"
          value={event.title}
          placeholder="No title"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('title', value)}
          showEditButton={!isEditing}
          onEditClick={() => onEditField && onEditField('title')}
        />
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <DateTimeField
              id="start"
              label="Start Date & Time"
              dateValue={formatDateOnly(event.date)}
              timeValue={formatTimeOnly(event.date)}
              isEditing={isEditing}
              onDateChange={(value) => handleDateTimeChange('date', 'date', value)}
              onTimeChange={(value) => handleDateTimeChange('date', 'time', value)}
              showEditButton={!isEditing}
              onEditClick={() => onEditField && onEditField('date')}
            />
          </div>
          
          <div className="relative">
            <DateTimeField
              id="end"
              label="End Date & Time"
              dateValue={formatDateOnly(event.end_date)}
              timeValue={formatTimeOnly(event.end_date)}
              isEditing={isEditing}
              onDateChange={(value) => handleDateTimeChange('end_date', 'date', value)}
              onTimeChange={(value) => handleDateTimeChange('end_date', 'time', value)}
              showEditButton={!isEditing}
              onEditClick={() => onEditField && onEditField('end_date')}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <FormField
          id="location"
          label="Location"
          value={event.location}
          placeholder="No location specified"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('location', value)}
          showEditButton={!isEditing}
          onEditClick={() => onEditField && onEditField('location')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <FormField
            id="category"
            label="Category"
            value={event.category}
            placeholder="Select a category"
            isEditing={isEditing}
            onChange={(value) => onFieldChange('category', value)}
            type={isEditing ? "select" : "text"}
            options={EVENT_CATEGORIES}
            showEditButton={!isEditing}
            onEditClick={() => onEditField && onEditField('category')}
          />
        </div>

        <div className="relative">
          <FormField
            id="expected_attendees"
            label="Expected Attendees"
            value={event.expected_attendees}
            placeholder="No attendees specified"
            isEditing={isEditing}
            onChange={(value) => onFieldChange('expected_attendees', value)}
            type="number"
            showEditButton={!isEditing}
            onEditClick={() => onEditField && onEditField('expected_attendees')}
          />
        </div>
      </div>
      
      <div className="relative">
        <FormField
          id="budget"
          label="Estimated Budget"
          value={getBudgetValue()}
          placeholder="No budget specified"
          isEditing={isEditing}
          onChange={(value) => {
            // Remove currency symbol and commas before saving
            const numericValue = value.toString().replace(/[$,]/g, '');
            onFieldChange('budget', numericValue);
          }}
          type="text"
          prefix="$"
          showEditButton={!isEditing}
          onEditClick={() => onEditField && onEditField('budget')}
        />
      </div>

      <div className="relative">
        <FormField
          id="description"
          label="Description"
          value={event.description}
          placeholder="No description provided"
          isEditing={isEditing}
          onChange={(value) => onFieldChange('description', value)}
          type="textarea"
          showEditButton={!isEditing}
          onEditClick={() => onEditField && onEditField('description')}
        />
      </div>

      {onDelete && (
        <div className="mt-6">
          <DeleteEventDialog onDelete={onDelete} disabled={event.status === 'completed'} />
        </div>
      )}
    </div>
  );
};
