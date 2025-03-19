
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFlexible, setIsFlexible] = useState("no");
  const [datetime, setDatetime] = useState("");
  const [localLocation, setLocalLocation] = useState(additionalInfo["location"] || "");

  // Reset form when dialog opens or additionalInfo changes
  useEffect(() => {
    if (open) {
      setErrors({});
      
      // Initialize date fields
      if (additionalInfo["date"]) {
        if (additionalInfo["date"] === "flexible") {
          setIsFlexible("yes");
          setDatetime("");
        } else {
          setIsFlexible("no");
          try {
            // Try to format the date for the datetime-local input
            const date = new Date(additionalInfo["date"]);
            if (!isNaN(date.getTime())) {
              setDatetime(date.toISOString().slice(0, 16));
            } else {
              setDatetime("");
            }
          } catch (e) {
            setDatetime("");
          }
        }
      } else {
        setIsFlexible("no");
        setDatetime("");
      }
      
      // Initialize location
      setLocalLocation(additionalInfo["location"] || "");
      
      console.log("MissingInfoDialog opened with:", { 
        missingInfo, 
        additionalInfo, 
        datetime, 
        localLocation 
      });
    }
  }, [open, additionalInfo]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate date if it's missing and not flexible
    if (missingInfo?.missingFields.includes("date") && isFlexible === "no" && !datetime) {
      newErrors["date"] = "Please select both date and time";
    }
    
    // Only validate location if it's missing
    if (missingInfo?.missingFields.includes("location") && !localLocation?.trim()) {
      newErrors["location"] = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log("Submitting missing info:", { isFlexible, datetime, localLocation });
    
    if (validateFields()) {
      // Update date based on flexibility choice
      if (isFlexible === "yes") {
        onAdditionalInfoChange("date", "flexible");
      } else if (datetime) {
        onAdditionalInfoChange("date", new Date(datetime).toISOString());
      }
      
      // Update location if provided
      if (localLocation) {
        onAdditionalInfoChange("location", localLocation);
      }
      
      // Show feedback to user
      toast({
        title: "Information received",
        description: "Generating your event now...",
      });
      
      // Call the submit callback which will handle closing the dialog
      onSubmit();
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLocation(e.target.value);
    // We update the local state, but don't immediately update parent state to avoid race conditions
  };

  // Don't render fields if there are no missing fields to display
  const hasMissingFieldsToDisplay = missingInfo && 
    missingInfo.missingFields && 
    missingInfo.missingFields.length > 0 &&
    (missingInfo.missingFields.includes("date") || missingInfo.missingFields.includes("location"));

  // If there's nothing to display, close the dialog
  useEffect(() => {
    if (open && (!missingInfo || !hasMissingFieldsToDisplay)) {
      console.log("No missing fields to display, closing dialog", missingInfo);
      onOpenChange(false);
    }
  }, [open, missingInfo, hasMissingFieldsToDisplay, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Additional Information Needed</DialogTitle>
          <DialogDescription>
            Please provide the following details to plan your event
          </DialogDescription>
        </DialogHeader>
        {hasMissingFieldsToDisplay ? (
          <>
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
                    value={localLocation}
                    onChange={handleLocationChange}
                    placeholder="Enter venue or location"
                    className={errors["location"] ? "border-red-500" : ""}
                  />
                  {errors["location"] && (
                    <span className="text-sm text-red-500">{errors["location"]}</span>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} className="w-full">
                Generate Event
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Loading required fields...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
