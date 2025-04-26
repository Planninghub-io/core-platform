
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
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
  eventTitle?: string;
  setEventTitle?: (title: string) => void;
  handleCreateEvent?: () => void;
  showSignUpPrompt?: boolean; // Add this prop
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  const handleTranscriptReceived = (transcript: string) => {
    // Update the prompt with the transcript
    const newPrompt = props.prompt ? `${props.prompt} ${transcript}` : transcript;
    props.setPrompt(newPrompt);
  };
  
  // Add debug logging to track the generatedEvent
  console.log("ChatInterface: Rendering with generatedEvent:", props.generatedEvent);
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ChatInterfaceRefactored 
        {...props}
        onTranscriptReceived={handleTranscriptReceived}
      />
    </div>
  );
};
