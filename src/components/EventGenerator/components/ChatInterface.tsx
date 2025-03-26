
import { ChatContainer } from "./chat/ChatContainer";
import { AIModelSelector } from "../components/AIModelSelector";
import { useState, useEffect } from "react";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>(props.modelProvider || 'openai');
  
  // Handle model change
  const handleModelChange = (model: 'openai' | 'anthropic') => {
    setModelProvider(model);
    if (props.onModelChange) {
      props.onModelChange(model);
    }
  };

  // Create a new wrapper for the submit handler to ensure proper logging
  const handleSubmit = () => {
    console.log("ChatInterface: Submit button clicked");
    if (props.handlePromptSubmit) {
      console.log("ChatInterface: Calling parent handlePromptSubmit with model:", modelProvider);
      // Pass the current modelProvider to the handler
      props.handlePromptSubmit(modelProvider);
    } else {
      console.error("ChatInterface: handlePromptSubmit prop is undefined");
    }
  };

  return (
    <div className="w-full min-h-[400px] flex flex-col">
      <div className="pb-4">
        <AIModelSelector 
          selectedModel={modelProvider} 
          onChange={handleModelChange} 
        />
      </div>
      <ChatContainer 
        {...props} 
        handlePromptSubmit={handleSubmit}
      />
    </div>
  );
};
