
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";

interface DateTimeFieldProps {
  label: string;
  dateValue: string;
  timeValue: string;
  isEditing: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  id: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export const DateTimeField = ({
  label,
  dateValue,
  timeValue,
  isEditing,
  onDateChange,
  onTimeChange,
  id,
  showEditButton = false,
  onEditClick
}: DateTimeFieldProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString || "";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return format(time, "h:mm a");
    } catch (e) {
      return timeString || "";
    }
  };

  // Split the label to extract main prefix (Start/End)
  const labelPrefix = label.split(" ")[0]; // This will get "Start" or "End"

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={`${id}-date`}>{label}</Label>
        {showEditButton && onEditClick && (
          <button 
            onClick={onEditClick}
            className="p-1 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          {isEditing ? (
            <Input
              id={`${id}-date`}
              type="date"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              required
              className="rounded-r-none"
            />
          ) : (
            <div className="flex h-10 w-full rounded-l-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background border-r-0">
              <span>{formatDate(dateValue)}</span>
            </div>
          )}
        </div>
        <div>
          {isEditing ? (
            <Input
              id={`${id}-time`}
              type="time"
              value={timeValue}
              onChange={(e) => onTimeChange(e.target.value)}
              required
              className="rounded-l-none border-l-0"
            />
          ) : (
            <div className="flex h-10 w-full rounded-r-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
              <span>{formatTime(timeValue)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
