
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
  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="flex items-center gap-2">
        {chatMessages.length === 0 ? (
          <div className="w-full">
            <EventGeneratorForm
              prompt={prompt}
              isGenerating={isGenerating}
              promptCount={promptCount}
              onPromptChange={setPrompt}
              onSubmit={handlePromptSubmit}
            />
          </div>
        ) : (
          <ChatInputField
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            generatedEvent={generatedEvent}
            chatMessages={chatMessages}
            handlePromptSubmit={handlePromptSubmit}
          />
        )}
      </div>
    </div>
  );
};
