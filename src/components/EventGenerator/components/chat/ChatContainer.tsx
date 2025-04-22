
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
        
        {isGenerating && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <img 
                src="photo-1486312338219-ce68d2c6f44d" 
                alt="Loading" 
                className="w-64 h-48 object-cover rounded-lg mx-auto opacity-80"
              />
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="text-sm text-gray-600">Your AI assistant is crafting a thoughtful response...</p>
            </div>
          </div>
        )}
        
        <div id="messages-end-ref" className="h-0" />
      </div>
    </ScrollArea>
  );
};
