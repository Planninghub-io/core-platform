
import { ChatMessage } from "../../ChatMessage";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Wand, Sparkles } from "lucide-react";
import { ModelDropdown } from "./ModelDropdown";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string, suggestions?: string[] }>;
  isGenerating: boolean;
  welcomeMessage: string;
  onTranscriptReceived?: (transcript: string) => void;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage,
  onTranscriptReceived,
  modelProvider = 'openai',
  onModelChange,
  onSuggestionClick
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

  // Welcome message with purple background - always visible
  const WelcomeMessage = () => {
    const initialSuggestions = [
      "Plan a birthday party",
      "Organize a corporate meeting",
      "Create a wedding event",
      "Set up a team building activity"
    ];
    
    return (
      <div className="w-full">
        {/* Welcome Banner - Full Width - Always Visible */}
        <div className="bg-[#8b73f4] bg-opacity-10 border border-[#8b73f4] border-opacity-30 rounded-lg p-4 w-full mb-4">
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
              <p className="font-medium text-[#8b73f4]">Welcome to Your AI Event Planner!</p>
              <p className="text-gray-700">Just type in the event details in the chat and I'll help you bring it to life!</p>
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
        
        {/* Suggestions Below Banner - Only show when no messages */}
        {chatMessages.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {initialSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-4 py-2 text-sm bg-white hover:bg-purple-50 text-purple-700 rounded-full border border-purple-200 transition-colors shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-[40vh] max-h-[50vh] overflow-hidden">
      {/* Welcome Banner - Static at top */}
      <div className="flex-shrink-0 px-3 pt-3">
        <WelcomeMessage />
      </div>
    <div className={`
      overflow-y-auto flex-1 w-full flex flex-col
      ${isMobile ? 'p-2 min-h-[35vh] max-h-[45vh]' : 'p-3 min-h-[40vh] max-h-[50vh]'}
    `}>
      <WelcomeMessage />
      
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {chatMessages && chatMessages.map((message, index) => (
        <div key={`message-${index}-${message.id || ''}`}>
          <ChatMessage 
            message={message.content} 
            type={message.type} 
            isLoading={false}
            disableTyping={true}
          />
          {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-4 px-4">
              {message.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1.5 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full border border-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {isGenerating && (
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
      )}
      
      <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
