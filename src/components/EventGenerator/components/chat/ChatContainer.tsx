
import { ChatMessages } from "./ChatMessages";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  isGenerating: boolean;
  promptCount: number;
  welcomeMessage: string;
  generatedEvent: any | null;
  hasMissingFields?: boolean;
  requiredFieldsCollected?: boolean;
  onTranscriptReceived?: (transcript: string) => void;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatContainer = ({
  chatMessages,
  isGenerating,
  promptCount,
  welcomeMessage,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false,
  onTranscriptReceived,
  modelProvider,
  onModelChange
}: ChatContainerProps) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const messagesEndRef = document.getElementById("messages-end-ref");
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating]);

  return (
    <ScrollArea className="h-[calc(70vh-4rem)] relative">
      <div className="flex-grow px-4">
        <ChatMessages 
          chatMessages={chatMessages} 
          isGenerating={isGenerating} 
          welcomeMessage={welcomeMessage} 
          onTranscriptReceived={onTranscriptReceived}
          modelProvider={modelProvider}
          onModelChange={onModelChange}
        />

        {/* Removed overlay loader! */}

        <div id="messages-end-ref" className="h-0" />
      </div>
    </ScrollArea>
  );
};
