
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInvitationPreview } from "../hooks/useInvitationPreview";
import { InvitationDialogHeader } from "./dialog/InvitationDialogHeader";
import { InvitationDialogContent } from "./dialog/InvitationDialogContent";
import { InvitationDialogFooter } from "./dialog/InvitationDialogFooter";
import { predefinedThemes } from "./ThemeSelector";

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
  const isMobile = useIsMobile();

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
      <DialogContent className={`${isMobile ? 'max-w-[95vw] p-4' : 'max-w-3xl'}`}>
        <InvitationDialogHeader 
          onShowThemeSelector={() => setShowThemeSelector(true)} 
        />
        
        <p className="text-sm text-muted-foreground mb-4">
          Preview your invitation and customize its appearance
        </p>
        
        <InvitationDialogContent 
          showThemeSelector={showThemeSelector}
          themeDescription={themeDescription}
          onThemeChange={onThemeChange}
          onCloseThemeSelector={() => setShowThemeSelector(false)}
          useCustomTheme={useCustomTheme}
          setUseCustomTheme={setUseCustomTheme}
          isLoading={isLoading}
          previewHtml={previewHtml}
          editableTitle={editableTitle}
          editableDescription={editableDescription}
          editableInviteText={editableInviteText}
          setEditableTitle={setEditableTitle}
          setEditableDescription={setEditableDescription}
          setEditableInviteText={setEditableInviteText}
          onPreviewBlur={generatePreview}
        />

        <InvitationDialogFooter 
          isEditing={isEditing} 
          onSubmit={handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};
