
import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Wand, Sparkles } from "lucide-react";

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
    console.log("ChatMessages: Rendering with", chatMessages?.length || 0, "messages");
    console.log("ChatMessages: Messages content:", chatMessages ? JSON.stringify(chatMessages.slice(-2)) : "No messages");
  }, [chatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Animation: Magic wand with sparkles and pulse
  const MagicWandLoader = () => (
    <div className="w-full flex justify-start">
      <div className="max-w-[85%] bg-gray-100 text-gray-900 rounded-2xl border border-gray-200 shadow-sm px-5 py-4 my-2 flex items-center gap-3 animate-fade-in">
        <div className="flex flex-col items-center justify-center shrink-0 relative">
          <Wand className="text-[#8B5CF6] animate-bounce" size={24} />
          <Sparkles
            className="text-yellow-400 absolute -top-2 -right-2 animate-pulse"
            size={14}
            style={{ zIndex: 1 }}
          />
        </div>
        <div>
          <span className="font-medium text-[#8B5CF6]">Magic in progress…</span>
          <div className="flex items-center mt-1 space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs mt-1 text-gray-500">Crafting your event details...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 overflow-y-auto flex-1 w-full flex flex-col min-h-[40vh] max-h-[50vh]">      
      {chatMessages && chatMessages.map((message, index) => (
        <ChatMessage 
          key={`message-${index}-${message.id || ''}`} 
          message={message.content} 
          type={message.type} 
          isLoading={false}
          disableTyping={true}
        />
      ))}
      
      {isGenerating && (
        <MagicWandLoader />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
