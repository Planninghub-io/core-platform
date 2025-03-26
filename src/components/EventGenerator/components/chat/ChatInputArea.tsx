
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
  
  // Wrapper function to handle submit with proper logging
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (prompt.trim() && !isGenerating) {
      console.log("ChatInputArea: handleSubmit called with prompt:", prompt);
      // Call the parent handler to process the submission
      handlePromptSubmit();
    } else {
      if (!prompt.trim()) {
        console.log("ChatInputArea: Empty prompt, not submitting");
      }
      if (isGenerating) {
        console.log("ChatInputArea: Already generating, not submitting");
      }
    }
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
