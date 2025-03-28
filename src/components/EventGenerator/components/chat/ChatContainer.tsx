
import { ChatMessages } from "./ChatMessages";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceInputButton } from "./VoiceInputButton";

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
  
  console.log("ChatContainer: Rendering with isGenerating =", isGenerating);
  console.log("ChatContainer: Chat messages:", chatMessages);
  
  useEffect(() => {
    const messagesEndRef = document.getElementById("messages-end-ref");
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating]);
  
  return (
    <div className="bg-white rounded-t-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full w-full">
      <div className="flex-grow overflow-auto">
        <div className="relative">
          <ChatMessages 
            chatMessages={chatMessages} 
            isGenerating={isGenerating} 
            welcomeMessage={welcomeMessage} 
            onTranscriptReceived={onTranscriptReceived}
          />
          {/* Position the voice input button in the top-right corner */}
          <div className="absolute top-4 right-4">
            <VoiceInputButton
              isGenerating={isGenerating}
              onTranscriptReceived={onTranscriptReceived}
              showLabel={false}
              className="transform-none"
            />
          </div>
        </div>
        <div id="messages-end-ref" className="h-0" />
      </div>
    </div>
  );
};
