
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface DateTimeFieldProps {
  label: string;
  dateValue: string;
  timeValue: string;
  isEditing: boolean;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  id: string;
}

export const DateTimeField = ({
  label,
  dateValue,
  timeValue,
  isEditing,
  onDateChange,
  onTimeChange,
  id
}: DateTimeFieldProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MM/dd/yyyy");
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return format(time, "h:mm a");
  };

  return (
    <div>
      <Label>{label}</Label>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-2">
          <Input
            id={`${id}-date`}
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            required
          />
          <Input
            id={`${id}-time`}
            type="time"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
            required
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
            {formatDate(dateValue)}
          </div>
          <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
            {formatTime(timeValue)}
          </div>
        </div>
      )}
    </div>
  );
};
