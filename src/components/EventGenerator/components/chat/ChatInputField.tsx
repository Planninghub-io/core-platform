
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedEvent: any | null;
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  handlePromptSubmit: () => void;
}

export const ChatInputField = ({
  prompt,
  setPrompt,
  isGenerating,
  generatedEvent,
  chatMessages,
  handlePromptSubmit
}: ChatInputFieldProps) => {
  // Only disable input when generation is in progress
  const isInputDisabled = isGenerating;
  
  // Only disable the submit button when: 
  // 1. Generation is in progress
  // 2. Prompt is empty 
  const isButtonDisabled = isGenerating || !prompt.trim();
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, prompt:", prompt);
    if (prompt.trim() && !isGenerating) {
      console.log("Calling handlePromptSubmit");
      handlePromptSubmit();
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isGenerating) {
      e.preventDefault();
      console.log("Enter key pressed, submitting");
      handlePromptSubmit();
    }
  };
  
  return (
    <form 
      className="flex items-center gap-2 w-full"
      onSubmit={onSubmit}
    >
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 py-3 px-4"
        placeholder="Type your message..."
        disabled={isInputDisabled}
      />
      <Button 
        type="button"
        onClick={() => {
          if (!isButtonDisabled) {
            console.log("Submit button clicked");
            handlePromptSubmit();
          }
        }}
        disabled={isButtonDisabled}
        size="icon"
        className="h-12 w-12 rounded-full bg-[#8b73f4] hover:bg-[#8b73f4]/90"
      >
        {isGenerating ? (
          <Sparkles className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};
