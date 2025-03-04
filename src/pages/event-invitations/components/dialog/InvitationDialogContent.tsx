
import { ThemeSelector } from "../ThemeSelector";
import { InvitationPreview } from "../InvitationPreview";

interface InvitationDialogContentProps {
  showThemeSelector: boolean;
  themeDescription: string;
  onThemeChange: (value: string) => void;
  onCloseThemeSelector: () => void;
  useCustomTheme: boolean;
  setUseCustomTheme: (value: boolean) => void;
  isLoading: boolean;
  previewHtml: string | null;
  editableTitle: string;
  editableDescription: string;
  editableInviteText: string;
  setEditableTitle: (value: string) => void;
  setEditableDescription: (value: string) => void;
  setEditableInviteText: (value: string) => void;
  onPreviewBlur: () => void;
}

export const InvitationDialogContent = ({
  showThemeSelector,
  themeDescription,
  onThemeChange,
  onCloseThemeSelector,
  useCustomTheme,
  setUseCustomTheme,
  isLoading,
  previewHtml,
  editableTitle,
  editableDescription,
  editableInviteText,
  setEditableTitle,
  setEditableDescription,
  setEditableInviteText,
  onPreviewBlur,
}: InvitationDialogContentProps) => {
  return showThemeSelector ? (
    <ThemeSelector
      themeDescription={themeDescription}
      onThemeChange={onThemeChange}
      onClose={onCloseThemeSelector}
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
        onBlur={onPreviewBlur}
      />
    </div>
  );
};
