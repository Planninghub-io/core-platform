
import { ChatMessages } from "./ChatMessages";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatContainerProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  isGenerating: boolean;
  promptCount: number;
  welcomeMessage: string;
  generatedEvent: any | null;
  hasMissingFields?: boolean;
  requiredFieldsCollected?: boolean;
  onTranscriptReceived?: (transcript: string) => void;
}

export const ChatContainer = ({
  chatMessages,
  isGenerating,
  promptCount,
  welcomeMessage,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false,
  onTranscriptReceived
}: ChatContainerProps) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const messagesEndRef = document.getElementById("messages-end-ref");
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating]);

  // Debug the generatedEvent
  useEffect(() => {
    if (generatedEvent) {
      console.log("ChatContainer received generatedEvent:", generatedEvent);
    }
  }, [generatedEvent]);
  
  return (
    <div className="flex-grow overflow-auto h-full">
      <ChatMessages 
        chatMessages={chatMessages} 
        isGenerating={isGenerating} 
        welcomeMessage={welcomeMessage} 
        onTranscriptReceived={onTranscriptReceived}
      />
      <div id="messages-end-ref" className="h-0" />
    </div>
  );
};
