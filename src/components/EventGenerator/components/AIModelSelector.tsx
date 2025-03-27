
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AIModelSelectorProps {
  selectedModel: 'openai' | 'anthropic';
  onChange: (model: 'openai' | 'anthropic') => void;
}

export const AIModelSelector = ({ selectedModel, onChange }: AIModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">AI Model</Label>
      <RadioGroup 
        defaultValue={selectedModel} 
        onValueChange={value => onChange(value as 'openai' | 'anthropic')}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="openai" id="openai" />
          <Label htmlFor="openai" className="font-normal cursor-pointer">ChatGPT</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="anthropic" id="anthropic" />
          <Label htmlFor="anthropic" className="font-normal cursor-pointer">Claude Sonnet</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
