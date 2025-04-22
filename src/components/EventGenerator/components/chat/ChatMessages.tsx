
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

  // Debug logging
  useEffect(() => {
    console.log("ChatMessages: Rendering with", chatMessages.length, "messages");
    console.log("ChatMessages: Messages content:", JSON.stringify(chatMessages.slice(-2)));
  }, [chatMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Updated welcome message with model selector
  const WelcomeMessageWithModelSelector = () => (
    <div className="w-full">
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
        <div className="flex items-center justify-center mb-4 mt-2">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">AI Model:</span>
            <ModelDropdown 
              modelProvider={modelProvider} 
              onModelChange={model => {
                if (onModelChange) onModelChange(model);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 overflow-y-auto flex-1 w-full flex flex-col min-h-[60vh]">
      {/* Show welcome message if no messages yet */}
      {chatMessages.length === 0 && <WelcomeMessageWithModelSelector />}

      {/* Render chat messages */}
      {chatMessages.map((message, index) => (
        <ChatMessage 
          key={`message-${index}-${message.id || ''}`} 
          message={message.content} 
          type={message.type} 
          isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
          disableTyping={true}
        />
      ))}
      
      {/* Show typing indicator when generating and no loading message exists */}
      {isGenerating && !chatMessages.some(msg => msg.type === 'ai' && msg.content === "Generating your event details...") && (
        <div className="flex items-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
      
      {/* This empty div helps with auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};
