
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
  // Only disable input when generation has completed, not during generation
  const isInputDisabled = isGenerating;
  
  // Only disable the submit button when: 
  // 1. Generation is in progress
  // 2. Prompt is empty 
  // 3. A generated event exists AND the last message is from AI (indicating completion)
  const isButtonDisabled = isGenerating || !prompt.trim() || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai');
  
  return (
    <>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isButtonDisabled) {
            e.preventDefault();
            handlePromptSubmit();
          }
        }}
        className="flex-1 rounded-md border border-gray-300 py-3 px-4"
        placeholder="Type your message..."
        disabled={isInputDisabled}
      />
      <Button 
        onClick={handlePromptSubmit} 
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
    </>
  );
};
