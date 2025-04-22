import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModelDropdown } from "./ModelDropdown";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  isGenerating: boolean;
  welcomeMessage: string;
  onTranscriptReceived?: (transcript: string) => void;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage,
  onTranscriptReceived,
  modelProvider = 'openai',
  onModelChange
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("ChatMessages: Rendering with", chatMessages.length, "messages");
    console.log("ChatMessages: Messages content:", JSON.stringify(chatMessages.slice(-2)));
  }, [chatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  const WelcomeMessageWithModelSelector = () => (
    <div className="w-full relative">
      <div className="mb-4">
        <ChatMessage
          key="welcome"
          message={
            "👋 Welcome to Your AI Event Planner!\n" +
            "Just type in the event details in the chat and I'll help you bring it to life!"
          }
          type="ai"
          isLoading={false}
          isWelcomeMessage={true}
          disableTyping={true}
        />
      </div>
      
      {onModelChange && (
        <div className="absolute top-0 right-3">
          <ModelDropdown 
            modelProvider={modelProvider} 
            onModelChange={model => {
              if (onModelChange) onModelChange(model);
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 overflow-y-auto flex-1 w-full flex flex-col min-h-[60vh]">
      {chatMessages.length === 0 && <WelcomeMessageWithModelSelector />}

      {chatMessages.map((message, index) => (
        <ChatMessage 
          key={`message-${index}-${message.id || ''}`} 
          message={message.content} 
          type={message.type} 
          isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
          disableTyping={true}
        />
      ))}
      
      {isGenerating && !chatMessages.some(msg => msg.type === 'ai' && msg.content === "Generating your event details...") && (
        <div className="flex items-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
