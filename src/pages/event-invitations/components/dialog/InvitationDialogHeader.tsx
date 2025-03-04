
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Palette } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvitationDialogHeaderProps {
  onShowThemeSelector: () => void;
}

export const InvitationDialogHeader = ({
  onShowThemeSelector,
}: InvitationDialogHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <p className="text-sm text-muted-foreground">
        Preview your invitation and customize its appearance
      </p>
      <Button 
        variant="outline" 
        onClick={onShowThemeSelector}
        className="flex items-center ml-4 whitespace-nowrap"
        size={isMobile ? "sm" : "default"}
      >
        <Palette className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} />
        {isMobile ? "Theme" : "Change Theme"}
      </Button>
    </DialogHeader>
  );
};
