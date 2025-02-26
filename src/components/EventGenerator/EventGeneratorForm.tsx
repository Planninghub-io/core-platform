
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventGeneratorFormProps {
  prompt: string;
  isGenerating: boolean;
  promptCount: number;
  onPromptChange: (value: string) => void;
  onSubmit: (dateTime?: string) => void;
}

export const EventGeneratorForm = ({
  prompt,
  isGenerating,
  promptCount,
  onPromptChange,
  onSubmit,
}: EventGeneratorFormProps) => {
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const checkForDateTime = (text: string) => {
    const dateTimePattern = /(?:on|at|date|time|when)?[:\s]?\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?(?:\s*(?:at|@)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?|\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)/i;
    return dateTimePattern.test(text);
  };

  const handleSubmit = () => {
    if (!checkForDateTime(prompt)) {
      setShowDateDialog(true);
      return;
    }
    onSubmit();
  };

  const handleDateTimeSubmit = () => {
    if (dateTime) {
      setShowDateDialog(false);
      onSubmit(dateTime);
    }
  };

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
          onClick={handleSubmit}
          size="sm"
          className="absolute bottom-4 right-4 gap-2 bg-[#8b73f4] hover:bg-[#8b73f4]/90"
          disabled={isGenerating}
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Plan it'}
        </Button>
      </div>
      {promptCount === 1 && (
        <p className="text-sm text-gray-500">
          You have used your free prompt. Sign up to generate more events!
        </p>
      )}

      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>When would you like to plan this event?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date and Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleDateTimeSubmit} disabled={!dateTime}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
