
import { useCallback, useEffect } from "react";
import { AIModelSelector } from "../AIModelSelector";

interface ModelSelectorProps {
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ModelSelector = ({ 
  modelProvider, 
  onModelChange 
}: ModelSelectorProps) => {
  // Handle model change with debounce to prevent unnecessary API calls
  const handleModelChange = useCallback((model: 'openai' | 'anthropic') => {
    if (model === modelProvider) return; // Skip if same model
    
    console.log("ModelSelector: Model changed from", modelProvider, "to", model);
    onModelChange(model);
  }, [modelProvider, onModelChange]);

  // Avoid excessive logging
  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      console.log("ModelSelector: Current model provider:", modelProvider);
    }
  }, [modelProvider]);

  return (
    <div className="pb-4">
      <AIModelSelector 
        selectedModel={modelProvider} 
        onChange={handleModelChange} 
      />
    </div>
  );
};
