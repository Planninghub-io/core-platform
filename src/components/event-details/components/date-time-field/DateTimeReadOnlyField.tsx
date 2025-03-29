
import { formatDate, formatTime } from '../../utils/dateTimeFormatters';

interface DateTimeReadOnlyFieldProps {
  dateValue: string;
  timeValue: string;
  handleFieldClick: () => void;
}

export const DateTimeReadOnlyField = ({
  dateValue,
  timeValue,
  handleFieldClick
}: DateTimeReadOnlyFieldProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <div 
          className="flex h-10 w-full rounded-l-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background border-r-0 cursor-pointer hover:bg-gray-100"
          onClick={handleFieldClick}
        >
          <span>{formatDate(dateValue || "")}</span>
        </div>
      </div>
      <div>
        <div 
          className="flex h-10 w-full rounded-r-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background cursor-pointer hover:bg-gray-100"
          onClick={handleFieldClick}
        >
          <span>{formatTime(timeValue || "")}</span>
        </div>
      </div>
    </div>
  );
};
