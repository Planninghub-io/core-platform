
import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Wand, Sparkles } from "lucide-react";
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
    console.log("ChatMessages: Rendering with", chatMessages?.length || 0, "messages");
    console.log("ChatMessages: Messages content:", chatMessages ? JSON.stringify(chatMessages.slice(-2)) : "No messages");
  }, [chatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  // Animation: Magic wand with sparkles and pulse
  /*const MagicWandLoader = () => (
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
  );*/

  // Welcome message with purple background - content removed as requested
  const WelcomeMessage = () => {
    if (chatMessages.length > 0) return null;
    
    return (
      <div className="w-full mb-6 px-4 flex justify-center">
        <div className="bg-[#8b73f4] bg-opacity-10 border border-[#8b73f4] border-opacity-30 rounded-lg p-4 max-w-[85%] w-full">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#8b73f4]">Welcome to Your AI Event Planner!</p>
              <p className="text-gray-700">Just type in the event details in the chat and I'll help you bring it to life!</p>
            </div>
            {onModelChange && (
              <div className="ml-auto">
                <ModelDropdown
                  modelProvider={modelProvider}
                  onModelChange={onModelChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 overflow-y-auto flex-1 w-full flex flex-col min-h-[40vh] max-h-[50vh]">
      {/* Add the welcome message */}
      <WelcomeMessage />
      
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
