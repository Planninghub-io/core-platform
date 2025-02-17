
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MissingInfo {
  needsInfo: true;
  missingFields: string[];
  message: string;
}

interface MissingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingInfo: MissingInfo | null;
  additionalInfo: Record<string, string>;
  onAdditionalInfoChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const MissingInfoDialog = ({
  open,
  onOpenChange,
  missingInfo,
  additionalInfo,
  onAdditionalInfoChange,
  onSubmit,
}: MissingInfoDialogProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isFlexible, setIsFlexible] = useState("no");
  const [time, setTime] = useState("");

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (missingInfo?.missingFields.includes("datetime") && !isFlexible && (!selectedDate || !time)) {
      newErrors["datetime"] = "Please select both date and time";
    }
    
    if (missingInfo?.missingFields.includes("location") && !additionalInfo["location"]?.trim()) {
      newErrors["location"] = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      if (selectedDate && time && !isFlexible) {
        const [hours, minutes] = time.split(":");
        const dateTime = new Date(selectedDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        onAdditionalInfoChange("datetime", dateTime.toISOString());
      } else if (isFlexible === "yes") {
        onAdditionalInfoChange("datetime", "flexible");
      }
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Additional Information Needed</DialogTitle>
          <DialogDescription>
            Please provide the following details to plan your event
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {missingInfo?.missingFields.includes("datetime") && (
            <div className="grid gap-2">
              <Label>Date & Time</Label>
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={isFlexible === "yes"}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={errors["datetime"] ? "border-red-500" : ""}
                  disabled={isFlexible === "yes"}
                />
                <RadioGroup value={isFlexible} onValueChange={setIsFlexible} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="flexible" />
                    <Label htmlFor="flexible">Date & time is flexible</Label>
                  </div>
                </RadioGroup>
                {errors["datetime"] && (
                  <span className="text-sm text-red-500">{errors["datetime"]}</span>
                )}
              </div>
            </div>
          )}
          
          {missingInfo?.missingFields.includes("location") && (
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={additionalInfo["location"] || ""}
                onChange={(e) => onAdditionalInfoChange("location", e.target.value)}
                placeholder="Enter venue or location"
                className={errors["location"] ? "border-red-500" : ""}
              />
              {errors["location"] && (
                <span className="text-sm text-red-500">{errors["location"]}</span>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              Estimated Budget
              <span className="text-sm text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={additionalInfo["budget"] || ""}
              onChange={(e) => onAdditionalInfoChange("budget", e.target.value)}
              placeholder="Enter estimated budget"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            Generate Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
