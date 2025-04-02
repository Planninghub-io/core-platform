
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AIModelSelectorProps {
  selectedModel: 'openai' | 'anthropic';
  onModelChange: (value: 'openai' | 'anthropic') => void;
}

export const AIModelSelector = ({ selectedModel, onModelChange }: AIModelSelectorProps) => {
  return (
    <Select value={selectedModel} onValueChange={(value: 'openai' | 'anthropic') => onModelChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
      </SelectContent>
    </Select>
  );
};
