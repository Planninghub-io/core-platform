
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { EventGeneratorForm } from "../EventGeneratorForm";
import { ChatInputField } from "./chat/ChatInputField";
import { useRef, useEffect, useState } from "react";

interface ChatInputProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  generatedEvent: any | null;
}

export const ChatInput = ({ 
  chatMessages, 
  prompt, 
  setPrompt, 
  isGenerating, 
  promptCount, 
  handlePromptSubmit,
  generatedEvent
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
              onSubmit={(_, submittedPrompt) => submittedPrompt && onSubmit(submittedPrompt)}
            />
          </div>
        ) : (
          <form 
            className="flex items-end gap-2" 
            onSubmit={(e) => {
              e.preventDefault();
              prompt.trim() && onSubmit(prompt);
            }}
          >
            <div className="flex-1">
              <ChatInputField
                ref={inputRef}
                prompt={prompt}
                setPrompt={setPrompt}
                isGenerating={isGenerating || isSubmitting}
                onSubmit={() => prompt.trim() && onSubmit(prompt)}
                shouldShowButton={false}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isGenerating || isSubmitting || !prompt.trim()}
              className="h-10 w-10 rounded-full bg-[#242424] hover:bg-[#242424]/90"
              onClick={() => prompt.trim() && onSubmit(prompt)}
            >
              <Send size={18} className="text-white" />
            </Button>
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
