
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatContainerProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  hasMissingFields?: boolean;
  requiredFieldsCollected?: boolean;
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export const ChatContainer = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  welcomeMessage,
  generatedEvent,
  hasMissingFields = false,
  requiredFieldsCollected = false,
  modelProvider,
  onModelChange
}: ChatContainerProps) => {
  const isMobile = useIsMobile();
  
  console.log("ChatContainer: Rendering with isGenerating =", isGenerating);
  console.log("ChatContainer: Chat messages:", chatMessages);
  
  useEffect(() => {
    // Scroll chat to bottom when messages update or during generation
    const messagesEndRef = document.getElementById("messages-end-ref");
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating]);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full w-full">
      <div className="flex-grow overflow-hidden">
        <ChatMessages 
          chatMessages={chatMessages} 
          isGenerating={isGenerating} 
          welcomeMessage={welcomeMessage} 
        />
        <div id="messages-end-ref" className="h-0" />
      </div>
      <ChatInputArea 
        chatMessages={chatMessages} 
        prompt={prompt} 
        setPrompt={setPrompt} 
        isGenerating={isGenerating} 
        promptCount={promptCount} 
        handlePromptSubmit={handlePromptSubmit}
        generatedEvent={generatedEvent}
        hasMissingFields={hasMissingFields}
        requiredFieldsCollected={requiredFieldsCollected}
        modelProvider={modelProvider}
        onModelChange={onModelChange}
      />
    </div>
  );
};
