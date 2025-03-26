
import { EventGeneratorForm } from "../../EventGeneratorForm";
import { ChatInputField } from "./ChatInputField";

interface ChatInputAreaProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string) => void;
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
  
  // Wrapper function to adapt the form's event-based submission to our string-based handler
  const handleSubmit = (e?: React.FormEvent, userPrompt?: string) => {
    if (e) {
      e.preventDefault();
    }
    
    // Use passed prompt if available, otherwise use state
    const submitPrompt = userPrompt || prompt;
    
    console.log("ChatInputArea: handleSubmit called with prompt:", submitPrompt);
    
    if (!submitPrompt || submitPrompt.trim() === "") {
      console.log("ChatInputArea: Empty prompt, not submitting");
      return;
    }
    
    // Call the parent handler to process the submission with the prompt
    handlePromptSubmit(submitPrompt);
    
    // Clear the prompt if we're using the state
    if (!userPrompt) {
      setPrompt("");
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
            handlePromptSubmit={handlePromptSubmit}
          />
        )}
      </div>
    </div>
  );
};
