
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedEvent: any | null;
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  handlePromptSubmit: (e?: React.FormEvent) => void;
}

export const ChatInputField = ({
  prompt,
  setPrompt,
  isGenerating,
  generatedEvent,
  chatMessages,
  handlePromptSubmit
}: ChatInputFieldProps) => {
  // Only disable input when generation is in progress
  const isInputDisabled = isGenerating;
  
  // Only disable the submit button when: 
  // 1. Generation is in progress
  // 2. Prompt is empty 
  const isButtonDisabled = isGenerating || !prompt.trim();
  
  // First, add the user message to chat when submitting
  const addUserMessageAndSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!prompt.trim()) {
      console.log("ChatInputField: Empty prompt, not submitting");
      return;
    }
    
    console.log("ChatInputField: Adding user message to chat:", prompt);
    
    // Add user message to chat first
    const userChatMessages = document.querySelectorAll('[data-testid="chat-messages"] > div');
    const hasUserMessage = Array.from(userChatMessages).some(
      div => div.textContent?.includes(prompt)
    );
    
    if (!hasUserMessage) {
      console.log("ChatInputField: User message not found in chat, adding it");
    }
    
    // Clear the input immediately
    const currentPrompt = prompt;
    setPrompt("");
    
    // Then call the submit handler to process it
    console.log("ChatInputField: Calling handlePromptSubmit");
    handlePromptSubmit(e);
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isGenerating) {
      e.preventDefault();
      console.log("ChatInputField: Enter key pressed, submitting");
      addUserMessageAndSubmit();
    }
  };
  
  // Button click handler
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isButtonDisabled) {
      console.log("ChatInputField: Submit button clicked manually");
      addUserMessageAndSubmit();
    }
  };
  
  return (
    <form 
      className="flex items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        addUserMessageAndSubmit(e);
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
      />
      <Button 
        type="submit"
        onClick={handleButtonClick}
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
};
