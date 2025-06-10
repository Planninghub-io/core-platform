
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDateMDY } from "../../utils/dateTimeUtils";

interface DateSelectorProps {
  id?: string;
  value: string | Date;
  onChange: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  minDate?: string;
}

export const DateSelector = ({ 
  id,
  value, 
  onChange, 
  disabled, 
  placeholder = "Select date",
  minDate
}: DateSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!value && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateMDY(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => date && onChange(date)}
          initialFocus
          className="p-3 pointer-events-auto"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
