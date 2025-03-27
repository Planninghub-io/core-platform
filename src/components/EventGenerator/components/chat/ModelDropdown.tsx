
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ModelDropdownProps {
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ModelDropdown = ({ 
  modelProvider, 
  onModelChange 
}: ModelDropdownProps) => {
  // Get display name for the model
  const getModelDisplayName = (model: 'openai' | 'anthropic') => {
    return model === 'openai' ? 'ChatGPT' : 'Claude Sonnet';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 gap-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          {getModelDisplayName(modelProvider)}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => onModelChange('openai')}
          className="flex justify-between"
        >
          ChatGPT
          {modelProvider === 'openai' && <Check size={16} />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onModelChange('anthropic')}
          className="flex justify-between"
        >
          Claude Sonnet
          {modelProvider === 'anthropic' && <Check size={16} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
