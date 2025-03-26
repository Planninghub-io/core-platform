
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { EventGeneratorForm } from "../EventGeneratorForm";
import { ChatInputField } from "./chat/ChatInputField";

interface ChatInputProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: () => void;
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
  // Create a wrapper function to ensure logging and proper execution
  const onSubmit = () => {
    console.log("ChatInput: onSubmit called");
    handlePromptSubmit();
  };
  
  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="w-full">
        {chatMessages.length === 0 ? (
          <div className="w-full">
            <EventGeneratorForm
              prompt={prompt}
              isGenerating={isGenerating}
              promptCount={promptCount}
              onPromptChange={setPrompt}
              onSubmit={onSubmit}
            />
          </div>
        ) : (
          <ChatInputField
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            generatedEvent={generatedEvent}
            chatMessages={chatMessages}
            handlePromptSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
};
