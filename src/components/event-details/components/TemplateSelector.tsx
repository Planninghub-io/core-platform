
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { InvitationTemplate } from "../types/invitation-dialog";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TemplateSelectorProps {
  templates: InvitationTemplate[];
  selectedTemplate: string;
  onTemplateSelect: (id: string) => void;
  onContinue: () => void;
}

export const TemplateSelector = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onContinue,
}: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<InvitationTemplate | null>(null);

  const handlePreview = (template: InvitationTemplate, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the template when clicking preview
    setPreviewTemplate(template);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {templates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No templates available for this event type
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handlePreview(template, e)}
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
              </div>
            </div>
          ))
        )}
      </div>
      <Button
        className="w-full"
        onClick={onContinue}
        disabled={!selectedTemplate || templates.length === 0}
      >
        Continue
      </Button>
    </div>
  );
};
