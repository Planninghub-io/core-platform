
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building, UserPlus } from "lucide-react";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUpIndividual: () => void;
  onSignUpBusiness: () => void;
  eventData?: any; // Add eventData prop
}

export const SignUpDialog = ({
  open,
  onOpenChange,
  onSignUpIndividual,
  onSignUpBusiness,
  eventData,
}: SignUpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Up to Continue</DialogTitle>
          <DialogDescription>
            Create an account to generate unlimited AI events and access more features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={onSignUpIndividual}
            className="w-full gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up as Individual
          </Button>
          <Button
            onClick={onSignUpBusiness}
            variant="outline"
            className="w-full gap-2 bg-blue-300/40 text-black hover:bg-blue-400/70 border-0"
          >
            <Building className="h-4 w-4" />
            Register as Business
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
