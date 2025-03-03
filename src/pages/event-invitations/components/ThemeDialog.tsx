
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [activeTab, setActiveTab] = useState<string>(isEditing ? "preview" : "customize");
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Set active tab based on editing status when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(isEditing ? "preview" : "customize");
      setShowThemeSelector(false);
    }
  }, [isOpen, isEditing]);

  // Generate preview when theme changes or dialog opens
  useEffect(() => {
    if (isOpen && eventDetails && themeDescription !== undefined) {
      generatePreview();
    }
  }, [isOpen, themeDescription, eventDetails]);

  const generatePreview = async () => {
    if (!eventDetails) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-invitation',
        {
          body: { 
            eventDetails,
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
    setShowThemeSelector(false);
  };

  const handleSubmit = () => {
    onSubmit(themeDescription || '');
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
              "Select from our predefined themes or enter a custom theme description" : 
              "Preview your invitation and customize its theme"}
          </DialogDescription>
        </DialogHeader>

        {showThemeSelector ? (
          <div className="space-y-4 py-4">
            <Select 
              value={themeDescription} 
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
            
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">Or enter a custom theme</h3>
              <Input
                placeholder="e.g., Modern minimalist with soft pastel colors"
                value={themeDescription}
                onChange={(e) => onThemeChange(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowThemeSelector(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                generatePreview();
                setShowThemeSelector(false);
              }}>
                Apply Theme
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview Invitation</TabsTrigger>
              <TabsTrigger value="customize">Customize Theme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="py-4">
              <div className="border rounded-lg overflow-hidden shadow-sm w-full min-h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : previewHtml ? (
                  <div 
                    className="overflow-auto max-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: previewHtml }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Enter a theme description and generate a preview
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowThemeSelector(true)}
                  className="flex items-center"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Change Theme
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="customize" className="py-4">
              <div className="space-y-4">
                <Input
                  placeholder="e.g., Modern minimalist with soft pastel colors"
                  value={themeDescription}
                  onChange={(e) => onThemeChange(e.target.value)}
                />
                <Button variant="outline" onClick={generatePreview} className="w-full">
                  Update Preview
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update Invitation" : "Generate Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
