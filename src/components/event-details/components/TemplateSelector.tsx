
import { Button } from "@/components/ui/button";

interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
  event_type: string;
  template_html: string;
  created_at: string;
}

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
      <div className="space-y-4">
        {templates.map((template) => (
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
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </div>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={onContinue}
        disabled={!selectedTemplate}
      >
        Continue
      </Button>
    </div>
  );
};
