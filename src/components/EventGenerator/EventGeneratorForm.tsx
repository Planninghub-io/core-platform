
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface EventGeneratorFormProps {
  prompt: string;
  isGenerating: boolean;
  promptCount: number;
  onPromptChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export const EventGeneratorForm = ({
  prompt,
  isGenerating,
  promptCount,
  onPromptChange,
  onSubmit,
}: EventGeneratorFormProps) => {
  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("EventGeneratorForm: form submitted with prompt:", prompt);
    
    if (prompt.trim()) {
      onSubmit(e);
    } else {
      console.log("EventGeneratorForm: Empty prompt, not submitting");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <input
          type="text"
          placeholder="Plan a fund raiser event..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && prompt.trim() && !isGenerating) {
              e.preventDefault();
              console.log("EventGeneratorForm: Enter key pressed");
              onSubmit();
            }
          }}
          className="w-full rounded-full border border-gray-300 py-3 px-4 pr-14"
          autoFocus
          data-testid="generator-input-field"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 h-10 w-10 rounded-full bg-[#8b73f4] hover:bg-[#8b73f4]/90"
          disabled={isGenerating || !prompt.trim()}
          data-testid="generator-submit-button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      
      {promptCount === 1 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
