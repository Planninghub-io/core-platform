
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";

interface ChatContainerProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
  welcomeMessage: string;
  generatedEvent: any | null;
}

export const ChatContainer = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  welcomeMessage,
  generatedEvent
}: ChatContainerProps) => {
  console.log("ChatContainer: Rendering with isGenerating =", isGenerating);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        <ChatMessages 
          chatMessages={chatMessages} 
          isGenerating={isGenerating} 
          welcomeMessage={welcomeMessage} 
        />
      </div>
      <ChatInputArea 
        chatMessages={chatMessages} 
        prompt={prompt} 
        setPrompt={setPrompt} 
        isGenerating={isGenerating} 
        promptCount={promptCount} 
        handlePromptSubmit={handlePromptSubmit}
        generatedEvent={generatedEvent} 
      />
    </div>
  );
};
