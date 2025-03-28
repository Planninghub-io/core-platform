import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  isGenerating: boolean;
  welcomeMessage: string;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage 
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

  // Enhanced welcome message for event creation
  const enhancedWelcomeMessage = 
    "👋 Welcome to Your Personal Event Planner!\n\n" +
    "I'm here to help you create the perfect event. Whether it's a:\n" +
    "• Birthday Party 🎂\n" +
    "• Business Conference 💼\n" +
    "• Wedding Celebration 💍\n" +
    "• Networking Mixer 🤝\n" +
    "• Or any other special occasion 🎉\n\n" +
    "**Just tell me about your event, and I'll help you bring it to life!**\n\n" +
    "Some tips to get started:\n" +
    "✨ Describe the type of event\n" +
    "✨ Share your preferred date and time\n" +
    "✨ Mention the location or venue style\n" +
    "✨ Let me know your estimated budget\n\n" +
    "I'm excited to help you plan an unforgettable event! 🚀";

  return (
    <div className={`p-4 ${isMobile ? 'h-[250px]' : 'h-[300px]'} overflow-y-auto w-full`}>
      {/* Show welcome message if no messages yet */}
      {chatMessages.length === 0 && (
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
          key={`message-${index}-${message.id || ''}`} 
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
