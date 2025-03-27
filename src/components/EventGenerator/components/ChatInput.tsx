
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { EventGeneratorForm } from "../EventGeneratorForm";
import { ChatInputField } from "./chat/ChatInputField";
import { ModelDropdown } from "./chat/ModelDropdown";
import { useRef, useEffect, useState } from "react";

interface ChatInputProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  generatedEvent: any | null;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatInput = ({ 
  chatMessages, 
  prompt, 
  setPrompt, 
  isGenerating, 
  promptCount, 
  handlePromptSubmit,
  generatedEvent,
  modelProvider = 'openai',
  onModelChange
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Focus the input field after generation completes
  useEffect(() => {
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGenerating]);
  
  // Create a wrapper function to ensure logging and proper execution
  const onSubmit = (submittedPrompt: string) => {
    console.log("ChatInput: onSubmit called with prompt:", submittedPrompt);
    
    if (submittedPrompt.trim() && !isGenerating && !isSubmitting) {
      setIsSubmitting(true);
      
      // Add a small delay to prevent double submissions
      setTimeout(() => {
        // Clear the prompt input immediately here
        setPrompt("");
        
        // Call the provided handlePromptSubmit with the submitted prompt
        handlePromptSubmit(submittedPrompt);
        
        // Reset submission state after a delay
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }, 100);
    }
  };
  
  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="w-full">
        {chatMessages.length === 0 ? (
          <div className="w-full">
            <EventGeneratorForm
              prompt={prompt}
              isGenerating={isGenerating || isSubmitting}
              promptCount={promptCount}
              onPromptChange={setPrompt}
              onSubmit={(_, submittedPrompt) => {
                if (submittedPrompt) {
                  onSubmit(submittedPrompt);
                  // Clear the prompt after submission
                  setPrompt("");
                }
              }}
            />
          </div>
        ) : (
          <form 
            className="flex items-center gap-2" 
            onSubmit={(e) => {
              e.preventDefault();
              if (prompt.trim()) {
                onSubmit(prompt);
              }
            }}
          >
            <div className="flex-1">
              <ChatInputField
                ref={inputRef}
                prompt={prompt}
                setPrompt={setPrompt}
                isGenerating={isGenerating || isSubmitting}
                onSubmit={() => {
                  if (prompt.trim()) {
                    onSubmit(prompt);
                  }
                }}
                shouldShowButton={false}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="icon"
                disabled={isGenerating || isSubmitting || !prompt.trim()}
                className="h-10 w-10 rounded-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
                onClick={() => {
                  if (prompt.trim()) {
                    onSubmit(prompt);
                  }
                }}
              >
                <Send size={18} className="text-white" />
              </Button>
              {modelProvider && onModelChange && (
                <ModelDropdown
                  modelProvider={modelProvider}
                  onModelChange={onModelChange}
                />
              )}
            </div>
          </form>
        )}
      </div>
      
      {promptCount === 1 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
