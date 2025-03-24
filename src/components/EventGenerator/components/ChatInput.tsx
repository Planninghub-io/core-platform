
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { EventGeneratorForm } from "../EventGeneratorForm";

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
          <>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                  e.preventDefault();
                  handlePromptSubmit();
                }
              }}
              className="flex-1 rounded-md border border-gray-300 py-3 px-4"
              placeholder="Type your message..."
              disabled={isGenerating || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai')}
            />
            <Button 
              onClick={handlePromptSubmit} 
              disabled={isGenerating || !prompt.trim() || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai')}
              size="icon"
              className="h-12 w-12 rounded-full bg-[#8b73f4] hover:bg-[#8b73f4]/90"
            >
              {isGenerating ? (
                <Sparkles className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
