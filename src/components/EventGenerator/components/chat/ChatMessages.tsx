
import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  isGenerating: boolean;
  welcomeMessage: string;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage 
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Debugging
  useEffect(() => {
    console.log("ChatMessages: Rendering with", chatMessages.length, "messages");
    console.log("ChatMessages: Messages content:", chatMessages);
  }, [chatMessages]);

  return (
    <div className="p-4 h-[400px] overflow-y-auto">
      {/* Show welcome message if no messages and welcomeMessage is provided */}
      {welcomeMessage && chatMessages.length === 0 && (
        <ChatMessage
          key="welcome"
          message={welcomeMessage}
          type="ai"
          isLoading={false}
          isWelcomeMessage={true}
        />
      )}
      
      {/* Map through and display all chat messages */}
      {chatMessages.map((message, index) => (
        <ChatMessage 
          key={`message-${index}`} 
          message={message.content} 
          type={message.type} 
          isLoading={false}
        />
      ))}
      
      {/* Show typing indicator when generating */}
      {isGenerating && (
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
