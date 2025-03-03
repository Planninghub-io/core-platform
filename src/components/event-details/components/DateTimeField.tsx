
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
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  return (
    <div>
      <Label>{label}</Label>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`${id}-date`} className="text-xs text-gray-500">Date</Label>
            <Input
              id={`${id}-date`}
              type="date"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor={`${id}-time`} className="text-xs text-gray-500">Time</Label>
            <Input
              id={`${id}-time`}
              type="time"
              value={timeValue}
              onChange={(e) => onTimeChange(e.target.value)}
              required
            />
          </div>
        </div>
      ) : (
        <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
          {formatDateTime(dateValue)}
        </div>
      )}
    </div>
  );
};
