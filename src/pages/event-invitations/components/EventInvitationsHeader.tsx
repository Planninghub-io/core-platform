
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";

interface EventInvitationsHeaderProps {
  title: string;
  hasInvitations: boolean;
  onBack: () => void;
  onOpenSendDialog: () => void;
}

export const EventInvitationsHeader = ({
  title,
  hasInvitations,
  onBack,
  onOpenSendDialog
}: EventInvitationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div>
        {hasInvitations && (
          <Button onClick={onOpenSendDialog} variant="default">
            <Send className="h-4 w-4 mr-2" />
            Send Invitations
          </Button>
        )}
      </div>
    </div>
  );
};
