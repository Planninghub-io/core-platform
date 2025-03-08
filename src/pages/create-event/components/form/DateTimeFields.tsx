
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock } from "lucide-react";
import { formatDateMDY } from "../../utils/dateTimeUtils";

interface DateTimeFieldsProps {
  date: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  timezone: string;
  isFlexibleDate: boolean;
  handleDateChange: (field: string, value: Date) => void;
  handleTimeChange: (field: string, value: string) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: any) => void;
}

// Timezone options with added short codes
const TIMEZONES = [
  { value: "UTC", label: "UTC", short: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)", short: "ET" },
  { value: "America/Chicago", label: "Central Time (CT)", short: "CT" },
  { value: "America/Denver", label: "Mountain Time (MT)", short: "MT" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", short: "PT" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)", short: "GMT" },
  { value: "Europe/Paris", label: "Central European Time (CET)", short: "CET" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", short: "JST" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)", short: "CST" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)", short: "AET" }
];

export const DateTimeFields = ({
  date,
  endDate,
  startTime,
  endTime,
  timezone,
  isFlexibleDate,
  handleDateChange,
  handleTimeChange,
  handleCheckboxChange,
  handleSelectChange,
}: DateTimeFieldsProps) => {
  // Find the current timezone short code
  const getTimezoneShort = (value: string) => {
    const zone = TIMEZONES.find(tz => tz.value === value);
    return zone?.short || value;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Start Date & Time *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDateMDY(date) : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(date) => date && handleDateChange('date', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <TimeSelector 
                value={startTime}
                onChange={(value) => handleTimeChange('startTime', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDateMDY(endDate) : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) => date && handleDateChange('endDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    disabled={(date) => {
                      // Disable dates before the start date
                      if (!date) return false;
                      const startDate = new Date(date);
                      startDate.setHours(0, 0, 0, 0);
                      return date < startDate;
                    }}
                  />
                </PopoverContent>
              </Popover>
              
              <TimeSelector 
                value={endTime}
                onChange={(value) => handleTimeChange('endTime', value)}
              />
            </div>
          </div>
        </div>

        {/* Timezone selector now comes after both date & time sections */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Time Zone *</Label>
          <Select
            value={timezone}
            onValueChange={(value) => handleSelectChange('timezone', value)}
          >
            <SelectTrigger className="w-full md:w-1/2">
              <Clock className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder="Select time zone">
                {TIMEZONES.find(tz => tz.value === timezone)?.label || timezone}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((timezone) => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2 items-center">
          <Checkbox 
            id="flexibleDate" 
            checked={isFlexibleDate}
            onCheckedChange={(checked) => handleCheckboxChange('isFlexibleDate', checked === true)}
          />
          <Label htmlFor="flexibleDate" className="cursor-pointer">Dates are flexible</Label>
        </div>
      </div>
    </>
  );
};

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <Clock className="h-4 w-4 mr-1 opacity-70" />
        <SelectValue placeholder="Time" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 24 }).map((_, hour) => (
          Array.from({ length: 4 }).map((_, minuteIdx) => {
            const minute = minuteIdx * 15;
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            const timeValue = `${hourStr}:${minuteStr}`;
            const ampm = hour < 12 ? 'AM' : 'PM';
            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const displayTime = `${hour12}:${minuteStr} ${ampm}`;
            
            return (
              <SelectItem key={timeValue} value={timeValue}>
                {displayTime}
              </SelectItem>
            );
          })
        ))}
      </SelectContent>
    </Select>
  );
};
