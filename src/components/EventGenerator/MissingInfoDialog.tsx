
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
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
  const [isFlexible, setIsFlexible] = useState("no");
  const [datetime, setDatetime] = useState("");

  useEffect(() => {
    if (open) {
      setErrors({});
      setDatetime("");
      setIsFlexible("no");
    }
  }, [open]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (missingInfo?.missingFields.includes("date") && isFlexible === "no" && !datetime) {
      newErrors["date"] = "Please select both date and time";
    }
    
    if (missingInfo?.missingFields.includes("location") && !additionalInfo["location"]?.trim()) {
      newErrors["location"] = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      if (datetime && isFlexible === "no") {
        onAdditionalInfoChange("date", new Date(datetime).toISOString());
      } else if (isFlexible === "yes") {
        onAdditionalInfoChange("date", "flexible");
      }
      
      // Don't automatically close the dialog
      // The parent component will handle closing after processing
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
          {missingInfo?.missingFields.includes("date") && (
            <div className="grid gap-2">
              <Label>Date & Time</Label>
              <div className="flex flex-col gap-2">
                <RadioGroup value={isFlexible} onValueChange={setIsFlexible} className="mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="flexible" />
                    <Label htmlFor="flexible">Date & time is flexible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="specific" />
                    <Label htmlFor="specific">Specific date & time</Label>
                  </div>
                </RadioGroup>
                {isFlexible === "no" && (
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      className={cn(errors["date"] ? "border-red-500" : "")}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                )}
                {errors["date"] && (
                  <span className="text-sm text-red-500">{errors["date"]}</span>
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
