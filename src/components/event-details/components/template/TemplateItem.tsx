
import React from "react";
import { InvitationTemplate } from "../../types/invitation-dialog";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateItemProps {
  template: InvitationTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TemplateItem = ({ template, isSelected, onSelect }: TemplateItemProps) => {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "hover:bg-accent"
      }`}
      onClick={() => onSelect(template.id)}
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
        <TemplatePreview template={template} />
      </div>
    </div>
  );
};
