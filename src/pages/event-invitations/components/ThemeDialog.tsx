
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { ThemeSelector, predefinedThemes } from "./ThemeSelector";
import { InvitationContentEditor } from "./InvitationContentEditor";
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
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [useCustomTheme, setUseCustomTheme] = useState(false);

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShowThemeSelector(false);
      setIsEditingContent(false);
      
      // Check if the current theme is custom or predefined
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
    isEditingContent
  );

  const handleSubmit = () => {
    // If content was edited, update event details before submitting
    if (isEditingContent && eventDetails) {
      const updatedEventDetails = {
        ...eventDetails,
        title: editableTitle,
        description: editableDescription
      };
      // Pass the updated content back through the theme
      onSubmit(themeDescription || '');
    } else {
      onSubmit(themeDescription || '');
    }
  };

  const toggleContentEditing = () => {
    if (!isEditingContent) {
      setIsEditingContent(true);
    } else {
      // Apply the edits and regenerate preview
      generatePreview();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Invitation Theme" : "Customize Invitation Theme"}
          </DialogTitle>
          <DialogDescription>
            {showThemeSelector ? 
              "Select from our predefined themes or create a custom theme" : 
              "Preview your invitation and customize its appearance"}
          </DialogDescription>
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
            {/* Theme change button in top right */}
            <div className="flex justify-end mb-2">
              <Button 
                variant="outline" 
                onClick={() => setShowThemeSelector(true)}
                className="flex items-center"
              >
                <Palette className="mr-2 h-4 w-4" />
                Change Theme
              </Button>
            </div>

            {/* Content editing toggle button */}
            {!showThemeSelector && (
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  onClick={toggleContentEditing}
                  className="flex items-center"
                >
                  {isEditingContent ? "Apply Content Changes" : "Edit Content"}
                </Button>
              </div>
            )}

            {/* Content editing UI */}
            {isEditingContent && (
              <InvitationContentEditor
                editableTitle={editableTitle}
                editableDescription={editableDescription}
                setEditableTitle={setEditableTitle}
                setEditableDescription={setEditableDescription}
              />
            )}

            {/* Preview */}
            <InvitationPreview
              isLoading={isLoading}
              previewHtml={previewHtml}
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
