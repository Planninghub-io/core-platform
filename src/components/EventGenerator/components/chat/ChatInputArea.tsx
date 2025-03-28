
import { ChatInputField } from "./ChatInputField";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { FormEvent, useRef } from "react";
import { ModelDropdown } from "./ModelDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputAreaProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  generatedEvent: any | null;
  hasMissingFields?: boolean;
  requiredFieldsCollected?: boolean;
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ChatInputArea = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false,
  modelProvider,
  onModelChange
}: ChatInputAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (inputRef.current && !isGenerating) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const submitPrompt = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedPrompt = prompt.trim();
    
    if (!trimmedPrompt || isGenerating) {
      return;
    }

    console.log("ChatInputArea: handleSubmit called with prompt:", trimmedPrompt);
    
    handlePromptSubmit(trimmedPrompt);
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {requiredFieldsCollected && !generatedEvent && !isGenerating && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          I have all the required details. Let me generate the event for you to review and create.
        </div>
      )}
      
      <form onSubmit={submitPrompt} className="flex items-center gap-2 w-full">
        <ChatInputField
          ref={inputRef}
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          onSubmit={submitPrompt}
          shouldShowButton={false}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            size="icon"
            disabled={isGenerating || !prompt.trim()}
            className="h-10 w-10 rounded-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
            aria-label="Send message"
          >
            <Send size={18} className="text-white" />
          </Button>
          {!isMobile && (
            <ModelDropdown 
              modelProvider={modelProvider}
              onModelChange={onModelChange}
            />
          )}
        </div>
      </form>
      
      {promptCount === 1 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
