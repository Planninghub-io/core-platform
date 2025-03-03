
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("customize");

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
            Describe your desired invitation theme, or leave it blank for a default elegant theme.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customize">Customize Theme</TabsTrigger>
            <TabsTrigger value="preview">Preview Invitation</TabsTrigger>
          </TabsList>
          
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
          </TabsContent>
        </Tabs>

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
