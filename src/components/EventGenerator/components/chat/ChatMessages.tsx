
import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceInputButton } from "./VoiceInputButton";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  isGenerating: boolean;
  welcomeMessage: string;
  onTranscriptReceived?: (transcript: string) => void;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage,
  onTranscriptReceived 
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

  // Handle transcript received
  const handleTranscriptReceived = (transcript: string) => {
    if (onTranscriptReceived) {
      onTranscriptReceived(transcript);
    }
  };

  // Updated welcome message with new content
  const enhancedWelcomeMessage = 
    "👋 Welcome to Your AI Event Planner!\n" +
    "Just type in the event details in the chat or talk to me clicking on the microphone icon and I'll help you bring it to life!\n\n" +
    "Some tips to get started:\n" +
    "✨ Describe the type of event\n" +
    "✨ Share your preferred date and time\n" +
    "✨ Mention the location or venue style\n" +
    "✨ Let me know your estimated budget";

  return (
    <div className="p-4 overflow-y-auto w-full flex flex-col">
      {/* Show welcome message if no messages yet */}
      {chatMessages.length === 0 && (
        <div className="w-full">
          <ChatMessage
            key="welcome"
            message={enhancedWelcomeMessage}
            type="ai"
            isLoading={false}
            isWelcomeMessage={true}
            disableTyping={true}
          />
        </div>
      )}

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
