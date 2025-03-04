
import React from "react";
import { InvitationTemplate } from "../../types/invitation-dialog";
import { TemplateItem } from "./TemplateItem";

interface TemplateListProps {
  templates: InvitationTemplate[];
  selectedTemplate: string;
  onTemplateSelect: (id: string) => void;
}

export const TemplateList = ({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect 
}: TemplateListProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No templates available for this event type
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
      {templates.map((template) => (
        <TemplateItem
          key={template.id}
          template={template}
          isSelected={selectedTemplate === template.id}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
};
