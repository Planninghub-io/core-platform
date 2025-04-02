
import React from 'react';
import { Button } from "@/components/ui/button";

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptSelect: (prompt: string) => void;
}

export const SuggestedPrompts = ({ prompts, onPromptSelect }: SuggestedPromptsProps) => {
  if (prompts.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {prompts.map((prompt, index) => (
        <Button 
          key={index} 
          variant="outline" 
          className="justify-start text-sm p-3 h-auto"
          onClick={() => onPromptSelect(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
};
