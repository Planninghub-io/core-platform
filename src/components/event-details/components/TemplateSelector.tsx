
import React from "react";
import { Button } from "@/components/ui/button";
import { InvitationTemplate } from "../types/invitation-dialog";
import { TemplateList } from "./template/TemplateList";

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
      <TemplateList
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
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
