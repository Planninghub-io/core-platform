
import { ChatInputField } from "./ChatInputField";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { FormEvent, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputAreaProps {
  chatMessages?: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount?: number;
  handlePromptSubmit?: (prompt: string) => void;
  onSubmit?: (input: string, modelProvider?: 'openai' | 'anthropic') => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  generatedEvent?: any | null;
  hasMissingFields?: boolean;
  requiredFieldsCollected?: boolean;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
  onTranscriptReceived?: (transcript: string) => void;
}

export const ChatInputArea = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount = 0,
  handlePromptSubmit,
  onSubmit,
  suggestions = [],
  onSuggestionClick,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false,
  modelProvider = 'openai',
  onModelChange,
  onTranscriptReceived
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
    
    if (onSubmit) {
      onSubmit(trimmedPrompt, modelProvider);
    } else if (handlePromptSubmit) {
      handlePromptSubmit(trimmedPrompt);
    }
  };

  const handleTranscriptReceived = (transcript: string) => {
    const newPrompt = prompt ? `${prompt} ${transcript}` : transcript;
    setPrompt(newPrompt);
    
    if (onTranscriptReceived) {
      onTranscriptReceived(transcript);
    }
  };

  return (
    <div className={`
      bg-white w-full rounded-b-xl sticky bottom-0
      ${isMobile ? 'px-3 py-3' : 'px-3 py-2'}
    `}> 
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
            className={`
              rounded-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90
              ${isMobile ? 'h-10 w-10' : 'h-9 w-9'}
            `}
            aria-label="Send message"
          >
            <Send size={isMobile ? 18 : 16} className="text-white" />
          </Button>
        </div>
      </form>
      
      {promptCount === 1 && (
        <p className={`
          text-gray-500 mt-2 text-center
          ${isMobile ? 'text-sm' : 'text-xs'}
        `}>
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
