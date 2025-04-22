
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AIModelSelector } from "../AIModelSelector";

// This component has been deprecated in favor of including the model selection
// directly in the welcome message. It's kept here for reference but is no longer used.

interface ModelSelectorProps {
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ModelSelector = ({ modelProvider, onModelChange }: ModelSelectorProps) => {
  return (
    <div className="absolute top-2 right-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => onModelChange(modelProvider === 'openai' ? 'anthropic' : 'openai')}
            >
              <Settings size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI Model: {modelProvider === 'openai' ? 'ChatGPT' : 'Claude Sonnet'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
