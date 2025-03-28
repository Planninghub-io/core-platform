
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
}

export const ChatContainer = ({
  chatMessages,
  isGenerating,
  promptCount,
  welcomeMessage,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false
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
        <ChatMessages 
          chatMessages={chatMessages} 
          isGenerating={isGenerating} 
          welcomeMessage={welcomeMessage} 
        />
        <div id="messages-end-ref" className="h-0" />
      </div>
    </div>
  );
};
