
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

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
      <div className="flex-grow">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 px-4"
          placeholder="Type your message..."
          disabled={isInputDisabled}
          data-testid="chat-input-field"
          ref={ref}
        />
        {isGenerating && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    );
  }
);

ChatInputField.displayName = "ChatInputField";
