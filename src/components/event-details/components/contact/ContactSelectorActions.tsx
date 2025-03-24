
import { Button } from "@/components/ui/button";

interface ContactSelectorActionsProps {
  onSend: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ContactSelectorActions = ({
  onSend,
  isLoading,
  disabled,
}: ContactSelectorActionsProps) => {
  return (
    <div className="flex justify-end">
      <Button
        className="w-full"
        onClick={onSend}
        disabled={isLoading || disabled}
      >
        {isLoading ? "Sending..." : "Send Invitations"}
      </Button>
    </div>
  );
};
