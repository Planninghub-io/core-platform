
import { Button } from "@/components/ui/button";

interface ContactSelectorActionsProps {
  onBack: () => void;
  onSend: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ContactSelectorActions = ({
  onBack,
  onSend,
  isLoading,
  disabled,
}: ContactSelectorActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button
        className="flex-1"
        onClick={onSend}
        disabled={isLoading || disabled}
      >
        {isLoading ? "Sending..." : "Send Invitations"}
      </Button>
    </div>
  );
};
