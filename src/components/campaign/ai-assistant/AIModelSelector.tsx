
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AIModelSelectorProps {
  selectedModel: 'openai' | 'anthropic';
  onModelChange: (value: 'openai' | 'anthropic') => void;
}

export const AIModelSelector = ({ selectedModel, onModelChange }: AIModelSelectorProps) => {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 p-0"
            >
              <Sparkles 
                className={`h-4 w-4 ${
                  selectedModel === 'openai' 
                    ? 'text-green-500' 
                    : 'text-purple-500'
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Current AI Model: {selectedModel === 'openai' ? 'GPT-4' : 'Claude'}</p>
        </TooltipContent>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onModelChange('openai')}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-green-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">GPT-4</span>
              <span className="text-xs text-gray-500">Balanced and efficient</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onModelChange('anthropic')}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Claude</span>
              <span className="text-xs text-gray-500">Advanced reasoning</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
};
