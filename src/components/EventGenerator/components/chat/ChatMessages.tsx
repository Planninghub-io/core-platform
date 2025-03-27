
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

  // Debug logging
  useEffect(() => {
    console.log("ChatMessages: Rendering with", chatMessages.length, "messages");
    console.log("ChatMessages: Messages content:", JSON.stringify(chatMessages.slice(-2)));
  }, [chatMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Enhanced welcome message with more details and formatting
  const enhancedWelcomeMessage = welcomeMessage ? 
    "Hi there! 👋 I'm your event planning assistant.\n\n" +
    "**Please provide details about the event you'd like to create:**\n" +
    "• Event type (party, meeting, conference, etc.)\n" +
    "• Date & time\n" +
    "• Location\n" +
    "• Expected number of attendees\n" +
    "• Budget (if applicable)\n" +
    "• Any other special requirements\n\n" +
    "Start typing and use our autocomplete suggestions to quickly add details! The more information you share, the better I can help you plan your perfect event!" : "";

  return (
    <div className="p-4 h-[400px] overflow-y-auto">
      {/* Show welcome message if no messages yet */}
      {chatMessages.length === 0 && enhancedWelcomeMessage && (
        <ChatMessage
          key="welcome"
          message={enhancedWelcomeMessage}
          type="ai"
          isLoading={false}
          isWelcomeMessage={true}
        />
      )}

      {/* Render chat messages */}
      {chatMessages.map((message, index) => (
        <ChatMessage 
          key={`message-${index}`} 
          message={message.content} 
          type={message.type} 
          isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
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
