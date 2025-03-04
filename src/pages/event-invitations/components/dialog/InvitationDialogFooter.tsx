
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface InvitationDialogFooterProps {
  isEditing: boolean;
  onSubmit: () => void;
}

export const InvitationDialogFooter = ({
  isEditing,
  onSubmit,
}: InvitationDialogFooterProps) => {
  return (
    <DialogFooter className="mt-4">
      <Button 
        onClick={onSubmit}
        className="w-full sm:w-auto"
      >
        {isEditing ? "Update Invitation" : "Generate Invitation"}
      </Button>
    </DialogFooter>
  );
};
