
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedEvent?: any | null;
  chatMessages?: Array<{ type: 'user' | 'ai', content: string }>;
  handlePromptSubmit?: (prompt: string) => void;
  onSubmit?: (e?: React.FormEvent) => void;
}

export const ChatInputField = forwardRef<HTMLInputElement, ChatInputFieldProps>(
  ({ prompt, setPrompt, isGenerating, generatedEvent, chatMessages, handlePromptSubmit, onSubmit }, ref) => {
    // Only disable input when generation is in progress
    const isInputDisabled = isGenerating;
    
    // Only disable the submit button when: 
    // 1. Generation is in progress
    // 2. Prompt is empty 
    const isButtonDisabled = isGenerating || !prompt.trim();
    
    // Handle form submission
    const handleSubmission = (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      if (!prompt.trim()) {
        console.log("ChatInputField: Empty prompt, not submitting");
        return;
      }
      
      console.log("ChatInputField: Submitting prompt:", prompt);
      
      // Use either the provided onSubmit or handlePromptSubmit function
      if (onSubmit) {
        onSubmit(e);
      } else if (handlePromptSubmit) {
        handlePromptSubmit(prompt);
        // Clear the input
        setPrompt("");
      }
    };
    
    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isGenerating) {
        e.preventDefault();
        console.log("ChatInputField: Enter key pressed, submitting");
        handleSubmission();
      }
    };
    
    return (
      <form 
        className="flex items-center gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmission(e);
        }}
      >
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-3 px-4"
          placeholder="Type your message..."
          disabled={isInputDisabled}
          data-testid="chat-input-field"
          ref={ref}
        />
        <Button 
          type="submit"
          disabled={isButtonDisabled}
          size="icon"
          className="h-12 w-12 rounded-full bg-[#8b73f4] hover:bg-[#8b73f4]/90"
          data-testid="chat-submit-button"
        >
          {isGenerating ? (
            <Sparkles className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    );
  }
);

ChatInputField.displayName = "ChatInputField";
