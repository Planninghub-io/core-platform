
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

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
  const isDisabled = isGenerating || !prompt.trim() || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai');
  
  return (
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
        disabled={isDisabled}
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
  );
};
