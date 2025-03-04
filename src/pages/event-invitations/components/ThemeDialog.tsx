import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { ThemeSelector, predefinedThemes } from "./ThemeSelector";
import { InvitationPreview } from "./InvitationPreview";
import { useInvitationPreview } from "../hooks/useInvitationPreview";

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  themeDescription: string;
  onThemeChange: (value: string) => void;
  onSubmit: (theme: string) => void;
  isEditing: boolean;
  eventDetails?: any;
}

export const ThemeDialog = ({
  isOpen,
  onClose,
  themeDescription,
  onThemeChange,
  onSubmit,
  isEditing = false,
  eventDetails,
}: ThemeDialogProps) => {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [editableTitle, setEditableTitle] = useState<string>("");
  const [editableDescription, setEditableDescription] = useState<string>("");
  const [editableInviteText, setEditableInviteText] = useState<string>("You are cordially invited to");
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [useCustomTheme, setUseCustomTheme] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowThemeSelector(false);
      setIsEditingContent(false);
      
      const isPredefined = predefinedThemes.some(theme => theme.value === themeDescription);
      setUseCustomTheme(!isPredefined && themeDescription !== "");
      
      if (eventDetails) {
        setEditableTitle(eventDetails.title || "");
        setEditableDescription(eventDetails.description || "");
      }
    }
  }, [isOpen, eventDetails, themeDescription]);

  const { previewHtml, isLoading, generatePreview } = useInvitationPreview(
    isOpen,
    themeDescription,
    eventDetails,
    editableTitle,
    editableDescription,
    editableInviteText,
    isEditingContent
  );

  const handleSubmit = () => {
    if (isEditingContent && eventDetails) {
      const updatedEventDetails = {
        ...eventDetails,
        title: editableTitle,
        description: editableDescription
      };
      onSubmit(themeDescription || '');
    } else {
      onSubmit(themeDescription || '');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Preview your invitation and customize its appearance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowThemeSelector(true)}
              className="flex items-center"
            >
              <Palette className="mr-2 h-4 w-4" />
              Change Theme
            </Button>
          </div>
        </DialogHeader>

        {showThemeSelector ? (
          <ThemeSelector
            themeDescription={themeDescription}
            onThemeChange={onThemeChange}
            onClose={() => setShowThemeSelector(false)}
            useCustomTheme={useCustomTheme}
            setUseCustomTheme={setUseCustomTheme}
          />
        ) : (
          <div className="space-y-4">
            <InvitationPreview
              isLoading={isLoading}
              previewHtml={previewHtml}
              isEditing={true}
              editableTitle={editableTitle}
              editableDescription={editableDescription}
              editableInviteText={editableInviteText}
              setEditableTitle={setEditableTitle}
              setEditableDescription={setEditableDescription}
              setEditableInviteText={setEditableInviteText}
              onBlur={generatePreview}
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>
            {isEditing ? "Update Invitation" : "Generate Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
