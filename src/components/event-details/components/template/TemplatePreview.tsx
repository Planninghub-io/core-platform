
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InvitationTemplate } from "../../types/invitation-dialog";

interface TemplatePreviewProps {
  template: InvitationTemplate;
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the template when clicking preview
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handlePreview}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Preview template</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0" 
        align="end"
        side="left"
      >
        <div className="p-1 max-h-[500px] overflow-y-auto">
          <div 
            className="border rounded-md shadow-sm overflow-hidden"
            dangerouslySetInnerHTML={{ __html: template.template_html }} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
