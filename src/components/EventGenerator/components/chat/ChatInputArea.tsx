
import { EventGeneratorForm } from "../../EventGeneratorForm";
import { ChatInputField } from "./ChatInputField";

interface ChatInputAreaProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: () => void;
  generatedEvent: any | null;
}

export const ChatInputArea = ({ 
  chatMessages, 
  prompt, 
  setPrompt, 
  isGenerating, 
  promptCount, 
  handlePromptSubmit,
  generatedEvent
}: ChatInputAreaProps) => {
  // Determine if this is the first interaction
  const isFirstInteraction = promptCount === 0 && chatMessages.length === 0;
  
  const handleSubmit = () => {
    console.log("ChatInputArea: handleSubmit called");
    handlePromptSubmit();
  };
  
  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="w-full">
        {isFirstInteraction ? (
          <EventGeneratorForm
            prompt={prompt}
            isGenerating={isGenerating}
            promptCount={promptCount}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
          />
        ) : (
          <ChatInputField
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            generatedEvent={generatedEvent}
            chatMessages={chatMessages}
            handlePromptSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};
