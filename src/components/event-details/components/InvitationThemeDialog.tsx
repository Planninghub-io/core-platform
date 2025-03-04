
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InvitationThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateInvitation: (theme: string) => void;
}

export const InvitationThemeDialog = ({
  isOpen,
  onClose,
  onGenerateInvitation,
}: InvitationThemeDialogProps) => {
  const [themeDescription, setThemeDescription] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Invitation Theme</DialogTitle>
          <DialogDescription>
            Describe your desired invitation theme, or leave it blank for a default elegant theme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="e.g., Modern minimalist with soft pastel colors"
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onGenerateInvitation(themeDescription)}>
            Generate Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
