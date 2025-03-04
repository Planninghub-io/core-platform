
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

  // Split the label to extract main prefix (Start/End)
  const labelPrefix = label.split(" ")[0]; // This will get "Start" or "End"

  return (
    <div>
      <Label htmlFor={`${id}-date`}>{label}</Label>
      
      {isEditing ? (
        <div className="flex w-full space-x-0">
          <div className="w-3/5">
            <Input
              id={`${id}-date`}
              type="date"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              required
              className="rounded-r-none"
            />
          </div>
          <div className="w-2/5">
            <Input
              id={`${id}-time`}
              type="time"
              value={timeValue}
              onChange={(e) => onTimeChange(e.target.value)}
              required
              className="rounded-l-none border-l-0"
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background">
            <span>{formatDate(dateValue)}</span>
            <span className="mx-2">at</span>
            <span>{formatTime(timeValue)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
