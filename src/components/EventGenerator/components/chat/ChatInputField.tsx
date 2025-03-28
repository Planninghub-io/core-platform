import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceInputButton } from "./VoiceInputButton";
import { ClearInputButton } from "./ClearInputButton";
import { useSuggestionManager } from "./SuggestionManager";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  shouldShowButton?: boolean;
  className?: string;
  generatedEvent?: any;
  chatMessages?: Array<{ type: 'user' | 'ai', content: string }>;
  handlePromptSubmit?: (prompt: string) => void;
}

export const ChatInputField = React.forwardRef<HTMLInputElement, ChatInputFieldProps>(
  ({ 
    prompt, 
    setPrompt, 
    isGenerating, 
    onSubmit, 
    shouldShowButton = false,
    className = '',
    generatedEvent,
    chatMessages,
    handlePromptSubmit 
  }, ref) => {
    const isMobile = useIsMobile();
    
    const {
      handleKeyNavigation,
      showSuggestionsOnFocus,
      suggestionsElement
    } = useSuggestionManager(
      prompt,
      setPrompt,
      isGenerating
    );

    const clearInput = () => {
      setPrompt("");
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // First check if suggestion navigation handled the key press
      const suggestionHandled = handleKeyNavigation(e);
      if (suggestionHandled) return;
      
      // Otherwise, handle submission on Enter
      if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isGenerating) {
        e.preventDefault();
        onSubmit();
      }
    };

    // Handle transcript received from voice assistant
    const handleTranscriptReceived = (transcript: string) => {
      // We need to directly set the prompt rather than using a callback function
      const newPrompt = prompt ? `${prompt} ${transcript}` : transcript;
      setPrompt(newPrompt);
    };

    return (
      <div className={`relative flex-1 ${className}`}>
        <Input
          ref={ref}
          type="text"
          placeholder={isMobile ? "Ask about an event..." : "Ask about planning an event..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-full pr-20 h-11" // Extended right padding for both icons
          disabled={isGenerating}
          onFocus={showSuggestionsOnFocus}
        />
        
        {suggestionsElement}
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Microphone button */}
          <VoiceInputButton 
            isGenerating={isGenerating}
            onTranscriptReceived={handleTranscriptReceived}
          />
          
          {/* Clear button - only show when there's text */}
          <ClearInputButton
            prompt={prompt}
            isGenerating={isGenerating}
            onClear={clearInput}
          />
        </div>

        {shouldShowButton && (
          <Button
            type="submit"
            size="icon"
            disabled={isGenerating || !prompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-[#242424] hover:bg-[#242424]/90"
            onClick={() => onSubmit()}
            aria-label="Send"
          >
            <span className="sr-only">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </Button>
        )}
      </div>
    );
  }
);

ChatInputField.displayName = "ChatInputField";
