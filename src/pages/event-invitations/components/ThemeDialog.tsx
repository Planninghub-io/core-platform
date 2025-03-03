
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  themeDescription: string;
  onThemeChange: (value: string) => void;
  onSubmit: (theme: string) => void;
  isEditing: boolean;
  eventDetails?: any;
}

const predefinedThemes = [
  { value: "elegant and professional", label: "Elegant & Professional" },
  { value: "colorful and vibrant", label: "Colorful & Vibrant" },
  { value: "minimalist modern", label: "Minimalist Modern" },
  { value: "dark and sophisticated", label: "Dark & Sophisticated" },
  { value: "pastel colors and soft design", label: "Pastel & Soft" },
  { value: "natural and earthy tones", label: "Natural & Earthy" },
  { value: "retro vintage style", label: "Retro Vintage" },
  { value: "futuristic and bold", label: "Futuristic & Bold" },
];

export const ThemeDialog = ({
  isOpen,
  onClose,
  themeDescription,
  onThemeChange,
  onSubmit,
  isEditing = false,
  eventDetails,
}: ThemeDialogProps) => {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [editableTitle, setEditableTitle] = useState<string>("");
  const [editableDescription, setEditableDescription] = useState<string>("");
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [useCustomTheme, setUseCustomTheme] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Generate preview when theme changes or dialog opens
  useEffect(() => {
    if (isOpen && eventDetails && themeDescription !== undefined) {
      generatePreview();
    }
  }, [isOpen, themeDescription, eventDetails, editableTitle, editableDescription]);

  const generatePreview = async () => {
    if (!eventDetails) return;
    
    setIsLoading(true);
    try {
      // Create a copy of event details with editable content if user is editing
      const eventDetailsCopy = {
        ...eventDetails,
        title: isEditingContent ? editableTitle : eventDetails.title,
        description: isEditingContent ? editableDescription : eventDetails.description
      };

      const { data, error } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails: eventDetailsCopy,
            theme: themeDescription || 'elegant and professional'
          }
        }
      );

      if (error) throw error;
      setPreviewHtml(data.template);
      
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSelect = (theme: string) => {
    onThemeChange(theme);
    setUseCustomTheme(false);
    setShowThemeSelector(false);
  };

  const handleCustomThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onThemeChange(e.target.value);
  };

  const toggleCustomTheme = (checked: boolean) => {
    setUseCustomTheme(checked);
    if (!checked) {
      // Reset to default theme when unchecking custom theme
      onThemeChange(predefinedThemes[0].value);
    }
  };

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
          <div className="space-y-4 py-4">
            <Select 
              value={!useCustomTheme ? themeDescription : ""} 
              onValueChange={handleThemeSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {predefinedThemes.map(theme => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="custom-theme" 
                checked={useCustomTheme}
                onCheckedChange={toggleCustomTheme}
              />
              <label
                htmlFor="custom-theme"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use custom theme
              </label>
            </div>
            
            {useCustomTheme && (
              <div className="mt-2">
                <Input
                  placeholder="e.g., Modern minimalist with soft pastel colors"
                  value={themeDescription}
                  onChange={handleCustomThemeChange}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setShowThemeSelector(false)}>
                Apply Theme
              </Button>
            </div>
          </div>
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
              <div className="space-y-4 mb-4 border p-4 rounded-md">
                <div>
                  <h3 className="text-sm font-medium mb-2">Event Title</h3>
                  <Input
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Event Description</h3>
                  <Textarea
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="border rounded-lg overflow-hidden shadow-sm w-full min-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : previewHtml ? (
                <div 
                  ref={contentRef}
                  className="overflow-auto max-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: previewHtml }} 
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Enter a theme description and generate a preview
                </div>
              )}
            </div>
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
