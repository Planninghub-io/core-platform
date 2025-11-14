
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventFormData } from "../types";
import { DateTimeFields } from "./form/DateTimeFields";
import { EventTypeFields } from "./form/EventTypeFields";
import { LocationField } from "./form/LocationField";
import { BudgetFields } from "./form/BudgetFields";
import { FormButtons } from "./form/FormButtons";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`
        space-y-6 rounded-xl bg-white shadow-lg
        ${isMobile ? 'p-4' : 'p-8'}
      `}
    >
      <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
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
          className={isMobile ? 'text-base' : ''}
        />
      </div>

      <DateTimeFields 
        date={typeof formData.date === 'string' ? formData.date : formData.date.toISOString()}
        endDate={typeof formData.endDate === 'string' ? formData.endDate : formData.endDate.toISOString()}
        startTime={formData.startTime}
        endTime={formData.endTime}
        timezone={formData.timezone}
        isFlexibleDate={formData.isFlexibleDate}
        handleDateChange={handleDateChange}
        handleTimeChange={handleTimeChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectChange={handleSelectChange}
      />

      <EventTypeFields 
        eventType={formData.eventType}
        venueType={formData.venueType}
        handleSelectChange={handleSelectChange}
      />

      <LocationField 
        location={formData.location}
        preferredLocations={formData.preferredLocations}
        isFlexibleLocation={formData.isFlexibleLocation}
        timezone={formData.timezone}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectChange={handleSelectChange}
      />

      <BudgetFields 
        budget={formData.budget}
        budgetCurrency={formData.budgetCurrency}
        attendees={formData.attendees}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <div className="space-y-2">
        <Label htmlFor="description">Special Requests / Additional Notes</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Any special requirements or additional information"
          className={`min-h-[100px] ${isMobile ? 'text-base' : ''}`}
        />
      </div>

      <FormButtons handleCancel={handleCancel} />
    </form>
  );
};
