
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvitationPreviewProps {
  isLoading: boolean;
  previewHtml: string | null;
  onContentClick?: () => void;
  isEditing: boolean;
  editableTitle: string;
  editableDescription: string;
  editableInviteText: string;
  setEditableTitle: (value: string) => void;
  setEditableDescription: (value: string) => void;
  setEditableInviteText: (value: string) => void;
  onBlur?: () => void;
}

export const InvitationPreview = ({
  isLoading,
  previewHtml,
  onContentClick,
  isEditing,
  editableTitle,
  editableDescription,
  editableInviteText,
  setEditableTitle,
  setEditableDescription,
  setEditableInviteText,
  onBlur
}: InvitationPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [parsedHtml, setParsedHtml] = useState<{titleHtml: string, inviteTextHtml: string, contentHtml: string, dateTimeHtml: string, locationHtml: string} | null>(null);
  const isMobile = useIsMobile();
  
  // Parse the HTML to separate editable and non-editable parts
  useEffect(() => {
    if (previewHtml && !isLoading) {
      const titleMatch = /<h1[^>]*>(.*?)<\/h1>/s.exec(previewHtml);
      const inviteTextMatch = /<p style="font-size: 18px;">(.*?)<\/p>/s.exec(previewHtml);
      const descMatch = /<p style="font-size: 24px;[^>]*>(.*?)<\/p>/s.exec(previewHtml);
      const dateTimeMatch = /<div style="margin-bottom: 20px;">\s*<p style="font-size: 20px;">Date & Time<\/p>.*?<\/div>/s.exec(previewHtml);
      const locationMatch = /<div style="margin-bottom: 20px;">\s*<p style="font-size: 20px;">Location<\/p>.*?<\/div>/s.exec(previewHtml);
      
      setParsedHtml({
        titleHtml: titleMatch ? titleMatch[1] : '',
        inviteTextHtml: inviteTextMatch ? inviteTextMatch[1] : '',
        contentHtml: descMatch ? descMatch[1] : '',
        dateTimeHtml: dateTimeMatch ? dateTimeMatch[0] : '',
        locationHtml: locationMatch ? locationMatch[0] : ''
      });
    }
  }, [previewHtml, isLoading]);

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm w-full min-h-[400px]">
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : previewHtml && parsedHtml ? (
        <div className={`${isMobile ? 'p-4' : 'p-10'} overflow-auto ${isMobile ? 'max-h-[350px]' : 'max-h-[400px]'}`}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {/* Title input */}
            <div className="w-full relative">
              <Input
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onBlur={onBlur}
                className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-center w-full border-transparent hover:border-input focus:border-input transition-colors`}
                placeholder="Event Title"
              />
            </div>
            
            {/* Invite text input */}
            <div className="w-full relative">
              <Input
                value={editableInviteText}
                onChange={(e) => setEditableInviteText(e.target.value)}
                onBlur={onBlur}
                className="text-lg text-center w-full border-transparent hover:border-input focus:border-input transition-colors"
                placeholder="Invitation message"
              />
            </div>
            
            {/* Description textarea */}
            <div className="w-full relative">
              <Textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                onBlur={onBlur}
                className={`${isMobile ? 'text-base' : 'text-xl'} text-center w-full min-h-[80px] border-transparent hover:border-input focus:border-input transition-colors resize-none`}
                placeholder="Event description"
                rows={isMobile ? 2 : 3}
              />
            </div>
            
            {/* Non-editable date and location */}
            <div className={isMobile ? "text-sm" : ""} dangerouslySetInnerHTML={{ __html: parsedHtml.dateTimeHtml }} />
            <div className={isMobile ? "text-sm" : ""} dangerouslySetInnerHTML={{ __html: parsedHtml.locationHtml }} />
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
