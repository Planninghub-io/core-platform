
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";

interface InvitationPreviewProps {
  isLoading: boolean;
  previewHtml: string | null;
}

export const InvitationPreview = ({
  isLoading,
  previewHtml,
}: InvitationPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
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
  );
};
