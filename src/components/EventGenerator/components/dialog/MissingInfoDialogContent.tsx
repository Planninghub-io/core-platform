
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DateTimeField } from "./DateTimeField";
import { LocationField } from "./LocationField";

interface MissingInfoDialogContentProps {
  missingFields: string[];
  isFlexible: string;
  setIsFlexible: (value: string) => void;
  datetime: string;
  setDatetime: (value: string) => void;
  localLocation: string;
  setLocalLocation: (value: string) => void;
  errors: Record<string, string>;
  handleSubmit: () => void;
}

export const MissingInfoDialogContent = ({
  missingFields,
  isFlexible,
  setIsFlexible,
  datetime,
  setDatetime,
  localLocation,
  setLocalLocation,
  errors,
  handleSubmit
}: MissingInfoDialogContentProps) => {
  if (!missingFields || missingFields.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Loading required fields...
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 py-4">
        {missingFields.includes("date") && (
          <DateTimeField
            isFlexible={isFlexible}
            setIsFlexible={setIsFlexible}
            datetime={datetime}
            setDatetime={setDatetime}
            error={errors["date"]}
          />
        )}
        
        {missingFields.includes("location") && (
          <LocationField
            location={localLocation}
            setLocation={setLocalLocation}
            error={errors["location"]}
          />
        )}
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit} className="w-full">
          Generate Event
        </Button>
      </DialogFooter>
    </>
  );
};
