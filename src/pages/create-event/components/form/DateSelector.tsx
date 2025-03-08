
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDateMDY } from "../../utils/dateTimeUtils";

interface DateSelectorProps {
  date: string | Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
}

export const DateSelector = ({ 
  date, 
  onSelect, 
  disabled, 
  placeholder = "Select date" 
}: DateSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDateMDY(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(date) => date && onSelect(date)}
          initialFocus
          className="p-3 pointer-events-auto"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
