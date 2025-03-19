
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MissingInfoDialogContent } from "./components/dialog/MissingInfoDialogContent";

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
        
        <MissingInfoDialogContent
          missingFields={hasMissingFieldsToDisplay ? missingInfo?.missingFields.filter(f => f === 'date' || f === 'location') || [] : []}
          isFlexible={isFlexible}
          setIsFlexible={setIsFlexible}
          datetime={datetime}
          setDatetime={setDatetime}
          localLocation={localLocation}
          setLocalLocation={setLocalLocation}
          errors={errors}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
