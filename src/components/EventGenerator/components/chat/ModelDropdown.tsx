
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelDropdownProps {
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
  className?: string;
}

export const ModelDropdown = ({ modelProvider, onModelChange, className }: ModelDropdownProps) => {
  const models = [
    {
      id: 'openai',
      name: 'GPT-4',
      description: 'Balanced and efficient',
      icon: Sparkles,
      iconColor: 'text-green-500',
    },
    {
      id: 'anthropic',
      name: 'Claude 3',
      description: 'Advanced reasoning',
      icon: Sparkles,
      iconColor: 'text-purple-500',
    },
  ];

  const selectedModel = models.find(model => model.id === modelProvider) || models[0];

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 p-0 hover:bg-gray-100",
                className
              )}
            >
              <selectedModel.icon className={`h-4 w-4 ${selectedModel.iconColor}`} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Current AI Model: {selectedModel.name}</p>
        </TooltipContent>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Select AI Model
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              className="flex items-center gap-2 py-2 cursor-pointer"
              onClick={() => onModelChange(model.id as 'openai' | 'anthropic')}
            >
              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${model.iconColor} bg-opacity-10`}>
                <model.icon className={`h-3 w-3 ${model.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{model.name}</span>
                <span className="text-xs text-gray-500">{model.description}</span>
              </div>
              {modelProvider === model.id && (
                <Check className="h-4 w-4 ml-auto text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
};
