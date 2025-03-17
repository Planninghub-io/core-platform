
import { ChatDisplay } from "./ChatDisplay";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: () => void;
  welcomeMessage: string;
  generatedEvent: any | null;
}

export const ChatInterface = ({
  chatMessages,
  prompt,
  setPrompt,
  isGenerating,
  promptCount,
  handlePromptSubmit,
  welcomeMessage,
  generatedEvent
}: ChatInterfaceProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <ChatDisplay 
        chatMessages={chatMessages} 
        isGenerating={isGenerating} 
        welcomeMessage={welcomeMessage} 
      />
      <ChatInput 
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
