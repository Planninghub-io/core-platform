
import { ChatContainer } from "./chat/ChatContainer";
import { AIModelSelector } from "../components/AIModelSelector";
import { useState, useEffect, useRef } from "react";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>(props.modelProvider || 'openai');
  const lastSubmissionRef = useRef<{ prompt: string, timestamp: number } | null>(null);
  
  // Handle model change
  const handleModelChange = (model: 'openai' | 'anthropic') => {
    console.log("ChatInterface: Model changed from", modelProvider, "to", model);
    setModelProvider(model);
    if (props.onModelChange) {
      props.onModelChange(model);
    }
  };

  // Create a new wrapper for the submit handler to ensure proper logging and debouncing
  const handleSubmit = (userPrompt: string) => {
    console.log("ChatInterface: Submit button clicked with prompt:", userPrompt);
    
    // Check for duplicate submissions
    const now = Date.now();
    if (lastSubmissionRef.current && 
        lastSubmissionRef.current.prompt === userPrompt && 
        now - lastSubmissionRef.current.timestamp < 3000) {
      console.log("ChatInterface: Ignoring duplicate submission within 3 seconds");
      return;
    }
    
    // Update last submission reference
    lastSubmissionRef.current = { prompt: userPrompt, timestamp: now };
    
    if (props.handlePromptSubmit && userPrompt) {
      console.log("ChatInterface: Calling parent handlePromptSubmit with model:", modelProvider);
      // Pass the current userPrompt and modelProvider to the handler
      props.handlePromptSubmit(userPrompt, modelProvider);
    } else {
      console.error("ChatInterface: handlePromptSubmit prop is undefined or prompt is empty");
    }
  };

  useEffect(() => {
    console.log("ChatInterface: Current model provider:", modelProvider);
  }, [modelProvider]);

  return (
    <div className="w-full min-h-[400px] flex flex-col">
      <div className="pb-4">
        <AIModelSelector 
          selectedModel={modelProvider} 
          onChange={handleModelChange} 
        />
      </div>
      <ChatContainer 
        chatMessages={props.chatMessages}
        prompt={props.prompt}
        setPrompt={props.setPrompt}
        isGenerating={props.isGenerating}
        promptCount={props.promptCount}
        handlePromptSubmit={handleSubmit}
        welcomeMessage={props.welcomeMessage}
        generatedEvent={props.generatedEvent}
      />
    </div>
  );
};
