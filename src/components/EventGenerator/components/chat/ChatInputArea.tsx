
import { ChatInputField } from "./ChatInputField";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { FormEvent, useRef } from "react";

interface ChatInputAreaProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  generatedEvent: any | null;
}

export const ChatInputArea = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  generatedEvent
}: ChatInputAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Focus the input field when the component mounts or after generation completes
    if (inputRef.current && !isGenerating) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const submitPrompt = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedPrompt = prompt.trim();
    
    // Don't submit if the prompt is empty or we're already generating
    if (!trimmedPrompt || isGenerating) {
      return;
    }

    console.log("ChatInputArea: handleSubmit called with prompt:", trimmedPrompt);
    
    // Call the provided handlePromptSubmit with the current prompt
    handlePromptSubmit(trimmedPrompt);
    
    // Clear the prompt input after submission
    setPrompt("");
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={submitPrompt} className="flex items-end gap-2">
        <ChatInputField
          ref={inputRef}
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          onSubmit={submitPrompt}
          shouldShowButton={false}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isGenerating || !prompt.trim()}
          className="h-10 w-10 rounded-full bg-[#242424] hover:bg-[#242424]/90"
        >
          <Send size={18} className="text-white" />
        </Button>
      </form>
      
      {promptCount === 1 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
