
import { useRef, useState } from "react";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./ChatInput";
import { Paper } from "./ui/Paper";
import { ChatInterfaceRefactored } from "./chat/ChatInterfaceRefactored";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string }>>>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  setSelectedDate?: (date: string) => void;
  setLocation?: (location: string) => void;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  // Enhanced chat interface with all required functionality
  return (
    <Paper className="flex flex-col h-full w-full overflow-hidden">
      <ChatInterfaceRefactored 
        {...props}
      />
    </Paper>
  );
};
