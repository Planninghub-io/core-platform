
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EventFormData } from "../types";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface EventFormProps {
  formData: EventFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: any) => void;
  handleDateChange: (field: string, value: Date) => void;
  handleTimeChange: (field: string, value: string) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

// Event type options
const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social Gathering" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "other", label: "Other" }
];

// Venue type options
const VENUE_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "restaurant", label: "Restaurant" },
  { value: "outdoors", label: "Outdoors" },
  { value: "banquet_hall", label: "Banquet Hall" },
  { value: "conference_center", label: "Conference Center" },
  { value: "gallery", label: "Gallery/Museum" },
  { value: "garden", label: "Garden/Park" },
  { value: "beach", label: "Beach" },
  { value: "private_residence", label: "Private Residence" },
  { value: "other", label: "Other" }
];

// Currency options
const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "INR", label: "INR (₹)" }
];

// Timezone options
const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" }
];

export const EventForm = ({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleTimeChange,
  handleCheckboxChange,
  handleSubmit,
  handleCancel
}: EventFormProps) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <p className="text-gray-600">Please input your event details</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Event Name *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event name"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Start Date & Time *</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.date && "text-muted-foreground"}`}
                  disabled={formData.isFlexibleDate}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(new Date(formData.date), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => date && handleDateChange('date', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center space-x-2">
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleTimeChange('startTime', value)}
                disabled={formData.isFlexibleDate}
              >
                <SelectTrigger className="w-full">
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
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date & Time *</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formData.endDate && "text-muted-foreground"}`}
                  disabled={formData.isFlexibleDate}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(new Date(formData.endDate), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => date && handleDateChange('endDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(date) => {
                    // Disable dates before the start date
                    if (!formData.date) return false;
                    const startDate = new Date(formData.date);
                    startDate.setHours(0, 0, 0, 0);
                    return date < startDate;
                  }}
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center space-x-2">
              <Select
                value={formData.endTime}
                onValueChange={(value) => handleTimeChange('endTime', value)}
                disabled={formData.isFlexibleDate}
              >
                <SelectTrigger className="w-full">
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
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 items-center">
        <Checkbox 
          id="flexibleDate" 
          checked={formData.isFlexibleDate}
          onCheckedChange={(checked) => handleCheckboxChange('isFlexibleDate', checked === true)}
        />
        <Label htmlFor="flexibleDate" className="cursor-pointer">Dates are flexible</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={formData.timezone}
          onValueChange={(value) => handleSelectChange('timezone', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timezone" />
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={formData.eventType}
            onValueChange={(value) => handleSelectChange('eventType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueType">Venue Type</Label>
          <Select
            value={formData.venueType}
            onValueChange={(value) => handleSelectChange('venueType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select venue type" />
            </SelectTrigger>
            <SelectContent>
              {VENUE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="location">Event Location *</Label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="flexibleLocation" 
              checked={formData.isFlexibleLocation}
              onCheckedChange={(checked) => handleCheckboxChange('isFlexibleLocation', checked === true)}
            />
            <Label htmlFor="flexibleLocation" className="cursor-pointer text-sm">Is flexible</Label>
          </div>
        </div>
        
        {formData.isFlexibleLocation ? (
          <Textarea
            id="preferredLocations"
            name="preferredLocations"
            value={formData.preferredLocations}
            onChange={handleChange}
            placeholder="Select preferred locations (limit to 4 cities)"
            className="min-h-[80px]"
          />
        ) : (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              className="pl-10"
              required={!formData.isFlexibleLocation}
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Total Budget *</Label>
          <div className="flex space-x-2">
            <Select
              value={formData.budgetCurrency}
              onValueChange={(value) => handleSelectChange('budgetCurrency', value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="budget"
              name="budget"
              type="number"
              step="0.01"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees"># of Attendees</Label>
          <Input
            id="attendees"
            name="attendees"
            type="number"
            min="1"
            step="1"
            value={formData.attendees}
            onChange={handleChange}
            placeholder="Number of expected guests"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Special Requests / Additional Notes</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Any special requirements or additional information"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#8B5CF6] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#8B5CF6]/90"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};
