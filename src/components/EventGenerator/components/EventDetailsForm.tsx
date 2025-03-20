
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { GeneratedEvent } from "@/hooks/event-generation/types";
import { TitleField } from "./form/TitleField";
import { DateTimeSection } from "./form/DateTimeSection";
import { LocationSection } from "./form/LocationSection";
import { CategorySection } from "./form/CategorySection";
import { BudgetSection } from "./form/BudgetSection";
import { DescriptionSection } from "./form/DescriptionSection";
import { CreateEventButton } from "./form/CreateEventButton";

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
  prompt?: string;
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
  handleCreateEvent,
  prompt = ""
}) => {
  const [category, setCategory] = useState(event.category || "Other");
  const [budget, setBudget] = useState(event.estimatedPrice || "Free");
  const [description, setDescription] = useState(event.description || "");
  
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-2">
        <TitleField 
          eventTitle={eventTitle} 
          setEventTitle={setEventTitle}
          prompt={prompt}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <DateTimeSection 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
          hasMissingDate={hasMissingDate}
        />
        
        <LocationSection 
          location={location} 
          setLocation={setLocation}
          hasMissingLocation={hasMissingLocation}
        />
        
        <CategorySection 
          category={category} 
          setCategory={setCategory}
        />
        
        <BudgetSection 
          budget={budget} 
          setBudget={setBudget}
        />
        
        <DescriptionSection 
          description={description} 
          setDescription={setDescription}
        />
      </CardContent>
      
      <CardFooter>
        <CreateEventButton 
          isCreating={isCreating}
          eventTitle={eventTitle}
          location={location}
          handleCreateEvent={handleCreateEvent}
        />
      </CardFooter>
    </Card>
  );
};
