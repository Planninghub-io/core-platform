
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Additional Information Needed</DialogTitle>
          <DialogDescription>
            {missingInfo?.message}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {missingInfo?.missingFields.map((field) => (
            <div key={field} className="grid gap-2">
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                value={additionalInfo[field] || ""}
                onChange={(e) => onAdditionalInfoChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} className="w-full">
            Generate Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
