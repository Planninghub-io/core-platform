
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

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

  // Split the label to extract main prefix (Start/End)
  const labelPrefix = label.split(" ")[0]; // This will get "Start" or "End"

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${id}-date`}>{labelPrefix} Date</Label>
          
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
          <Label htmlFor={`${id}-time`}>Time</Label>
          
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
