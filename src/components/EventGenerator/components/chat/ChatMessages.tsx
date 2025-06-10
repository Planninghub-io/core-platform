
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

  const MagicWandLoader = () => (
    <div className="w-full flex justify-start">
      <div className={`
        max-w-[85%] bg-gray-100 text-gray-900 rounded-2xl border border-gray-200 shadow-sm 
        my-2 flex items-center gap-3 animate-fade-in
        ${isMobile ? 'px-4 py-3' : 'px-5 py-4'}
      `}>
        <div className="flex flex-col items-center justify-center shrink-0 relative">
          <Wand className="text-[#8B5CF6] animate-bounce" size={isMobile ? 20 : 24} />
          <Sparkles
            className="text-yellow-400 absolute -top-2 -right-2 animate-pulse"
            size={isMobile ? 12 : 14}
            style={{ zIndex: 1 }}
          />
        </div>
        <div>
          <span className={`font-medium text-[#8B5CF6] ${isMobile ? 'text-sm' : ''}`}>
            Magic in progress…
          </span>
          <div className="flex items-center mt-1 space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className={`mt-1 text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            Crafting your event details...
          </p>
        </div>
      </div>
    </div>
  );

  const WelcomeMessage = () => {
    if (chatMessages.length > 0) return null;
    
    return (
      <div className="w-full">
        <div className={`
          bg-[#8b73f4] bg-opacity-10 border border-[#8b73f4] border-opacity-30 rounded-lg 
          ${isMobile ? 'mx-2 p-3' : 'mx-3 p-4'}
        `}>
          <div className="flex items-start gap-3">
            <div className={`
              mt-1 flex items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0
              ${isMobile ? 'h-7 w-7' : 'h-8 w-8'}
            `}>
              <Sparkles size={isMobile ? 16 : 18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className={`
                  font-medium text-[#8b73f4]
                  ${isMobile ? 'text-sm' : ''}
                `}>
                  Welcome to Your AI Event Planner!
                </p>
                {onModelChange && !isMobile && (
                  <ModelDropdown
                    modelProvider={modelProvider}
                    onModelChange={onModelChange}
                  />
                )}
              </div>
              <p className={`
                text-gray-700
                ${isMobile ? 'text-sm' : ''}
              `}>
                Just type in the event details in the chat and I'll help you bring it to life!
              </p>
              {onModelChange && isMobile && (
                <div className="mt-2">
                  <ModelDropdown
                    modelProvider={modelProvider}
                    onModelChange={onModelChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`
      overflow-y-auto flex-1 w-full flex flex-col
      ${isMobile ? 'p-2 min-h-[35vh] max-h-[45vh]' : 'p-3 min-h-[40vh] max-h-[50vh]'}
    `}>
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
