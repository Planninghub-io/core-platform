
import React from "react";
import { Check, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelDropdownProps {
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ModelDropdown = ({ 
  modelProvider, 
  onModelChange 
}: ModelDropdownProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <Settings size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>AI Model</DropdownMenuLabel>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Model</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
