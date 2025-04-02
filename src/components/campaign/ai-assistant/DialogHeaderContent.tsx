
import React from 'react';
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface DialogHeaderContentProps {
  onClose: () => void;
}

export const DialogHeaderContent = ({ onClose }: DialogHeaderContentProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <DialogTitle className="text-xl">Campaign AI Assistant</DialogTitle>
        <DialogDescription>
          Create campaign events with AI assistance from OpenAI or Claude
        </DialogDescription>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
