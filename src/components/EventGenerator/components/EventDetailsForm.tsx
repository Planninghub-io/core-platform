
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Users, Tag } from "lucide-react";
import { GeneratedEvent } from "@/hooks/event-generation/types";
import { DatePicker } from "../DatePicker";

interface EventDetailsFormProps {
  event: GeneratedEvent;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  isCreating: boolean;
  handleCreateEvent: () => void;
}

export const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  event,
  eventTitle,
  setEventTitle,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  hasMissingDate,
  hasMissingLocation,
  isCreating,
  handleCreateEvent
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [description, setDescription] = useState(event.description || "");
  const [category, setCategory] = useState(event.category || "Other");
  const [budget, setBudget] = useState(event.estimatedPrice || "Free");
  const [isFlexibleDate, setIsFlexibleDate] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === "flexible") return "";
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format for input
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate.toISOString());
    }
  };

  const handleFlexibleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFlexibleDate(e.target.checked);
    if (e.target.checked) {
      setSelectedDate("Flexible");
    } else {
      setSelectedDate("");
    }
  };

  // Event categories
  const EVENT_CATEGORIES = [
    { value: "Wedding", label: "Wedding" },
    { value: "Birthday", label: "Birthday" },
    { value: "Corporate", label: "Corporate Event" },
    { value: "Conference", label: "Conference" },
    { value: "Seminar", label: "Seminar" },
    { value: "Social", label: "Social Gathering" },
    { value: "Other", label: "Other" }
  ];

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-2">
        <Input
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          onFocus={() => {
            setIsTitleFocused(true);
            if (eventTitle === 'Enter Event Name') {
              setEventTitle('');
            }
          }}
          onBlur={() => {
            setIsTitleFocused(false);
            if (!eventTitle.trim()) {
              setEventTitle('Enter Event Name');
            }
          }}
          placeholder="Enter event title"
          className={`text-xl font-semibold ${
            (eventTitle === 'Enter Event Name' && !isTitleFocused) ? 'text-gray-400 italic' : ''
          }`}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Label htmlFor="date">Date & Time</Label>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="checkbox" 
              id="flexibleDate"
              checked={isFlexibleDate}
              onChange={handleFlexibleDateChange}
              className="h-4 w-4"
            />
            <Label htmlFor="flexibleDate" className="text-sm font-normal cursor-pointer">
              Date is flexible
            </Label>
          </div>
          
          {!isFlexibleDate && (
            <DatePicker 
              date={selectedDate ? new Date(selectedDate) : undefined}
              onDateChange={handleDateChange}
              disabled={isFlexibleDate}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Label htmlFor="location">Location</Label>
          </div>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter venue or location"
            className={hasMissingLocation ? "border-red-300 focus:border-red-500" : ""}
          />
          {hasMissingLocation && !location && (
            <p className="text-sm text-red-500">Location is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <Label htmlFor="category">Event Type</Label>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <Label htmlFor="budget">Budget</Label>
          </div>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your budget"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleCreateEvent}
          disabled={isCreating || eventTitle === 'Enter Event Name' || !eventTitle.trim() || !location}
          className="w-full"
        >
          {isCreating ? 'Creating Event...' : 'Create This Event'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Import useState at the top
import { useState } from "react";
