
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";

interface InvitationPreviewProps {
  isLoading: boolean;
  previewHtml: string | null;
  onContentClick?: () => void;
  isEditing: boolean;
  editableTitle: string;
  editableDescription: string;
  setEditableTitle: (value: string) => void;
  setEditableDescription: (value: string) => void;
}

export const InvitationPreview = ({
  isLoading,
  previewHtml,
  onContentClick,
  isEditing,
  editableTitle,
  editableDescription,
  setEditableTitle,
  setEditableDescription
}: InvitationPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [parsedHtml, setParsedHtml] = useState<{titleHtml: string, contentHtml: string, dateTimeHtml: string, locationHtml: string} | null>(null);
  
  // Parse the HTML to separate editable and non-editable parts
  useEffect(() => {
    if (previewHtml && !isLoading) {
      // Use a simple regex approach to extract parts of the template
      const titleMatch = /<h1[^>]*>(.*?)<\/h1>/s.exec(previewHtml);
      const descMatch = /<p style="font-size: 24px;[^>]*>(.*?)<\/p>/s.exec(previewHtml);
      const dateTimeMatch = /<div style="margin-bottom: 20px;">\s*<p style="font-size: 20px;">Date & Time<\/p>.*?<\/div>/s.exec(previewHtml);
      const locationMatch = /<div style="margin-bottom: 20px;">\s*<p style="font-size: 20px;">Location<\/p>.*?<\/div>/s.exec(previewHtml);
      
      setParsedHtml({
        titleHtml: titleMatch ? titleMatch[1] : '',
        contentHtml: descMatch ? descMatch[1] : '',
        dateTimeHtml: dateTimeMatch ? dateTimeMatch[0] : '',
        locationHtml: locationMatch ? locationMatch[0] : ''
      });
    }
  }, [previewHtml, isLoading]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm w-full min-h-[400px]">
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : previewHtml && parsedHtml ? (
        <div className={`p-10 overflow-auto max-h-[400px] ${!isEditing && onContentClick ? "cursor-pointer" : ""}`}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {/* Editable or display title */}
            {isEditing ? (
              <Input
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-3xl font-bold text-center w-full"
              />
            ) : (
              <h1 
                className="text-3xl font-bold"
                dangerouslySetInnerHTML={{ __html: parsedHtml.titleHtml }}
                onClick={onContentClick}
              />
            )}
            
            <p className="text-lg">You are cordially invited to</p>
            
            {/* Editable or display description */}
            {isEditing ? (
              <Textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                className="text-xl text-center w-full"
                rows={3}
              />
            ) : (
              <p 
                className="text-xl"
                dangerouslySetInnerHTML={{ __html: parsedHtml.contentHtml }}
                onClick={onContentClick}
              />
            )}
            
            {/* Non-editable date and location */}
            <div dangerouslySetInnerHTML={{ __html: parsedHtml.dateTimeHtml }} />
            <div dangerouslySetInnerHTML={{ __html: parsedHtml.locationHtml }} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          Enter a theme description and generate a preview
        </div>
      )}
    </div>
  );
};
