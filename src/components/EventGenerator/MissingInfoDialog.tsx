
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
import { useState } from "react";

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

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    missingInfo?.missingFields.forEach(field => {
      if (!additionalInfo[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit();
    }
  };

  const getInputPlaceholder = (field: string) => {
    switch (field) {
      case "date":
        return "Enter date and time (e.g., July 15, 2024 at 6:00 PM)";
      case "location":
      case "city":
        return "Enter location or city name";
      default:
        return `Enter ${field}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Additional Information Needed</DialogTitle>
          <DialogDescription>
            Please provide the following details to generate your event
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {missingInfo?.missingFields.map((field) => (
            <div key={field} className="grid gap-2">
              <Label htmlFor={field} className="flex items-center justify-between">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {errors[field] && (
                  <span className="text-sm text-red-500">{errors[field]}</span>
                )}
              </Label>
              <Input
                id={field}
                value={additionalInfo[field] || ""}
                onChange={(e) => {
                  onAdditionalInfoChange(field, e.target.value);
                  if (errors[field]) {
                    setErrors(prev => ({ ...prev, [field]: "" }));
                  }
                }}
                placeholder={getInputPlaceholder(field)}
                className={errors[field] ? "border-red-500" : ""}
              />
            </div>
          ))}
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
