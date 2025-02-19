
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EventGeneratorFormProps {
  prompt: string;
  isGenerating: boolean;
  promptCount: number;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
}

export const EventGeneratorForm = ({
  prompt,
  isGenerating,
  promptCount,
  onPromptChange,
  onSubmit,
}: EventGeneratorFormProps) => {
  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-2xl">
        <Textarea
          placeholder="Describe your event idea... (e.g., 'Create a summer music festival in Central Park with local bands and food trucks')"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[200px] resize-none rounded-xl border-gray-200 p-4 text-base shadow-sm focus:border-primary focus:ring-primary"
        />
        <Button
          onClick={onSubmit}
          size="sm"
          className="absolute bottom-4 right-4 gap-2 bg-[#9b87f5] hover:bg-[#8b73f4]"
          disabled={isGenerating}
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      {promptCount === 1 && (
        <p className="text-sm text-gray-500">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}
    </div>
  );
};
