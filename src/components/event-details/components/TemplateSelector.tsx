
import { Button } from "@/components/ui/button";
import { InvitationTemplate } from "../types/invitation-dialog";

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
              <h3 className="font-semibold">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              )}
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
