
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Sparkles, UserPlus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already used their free prompt
    if (promptCount >= 1) {
      setShowSignUpDialog(true);
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-event', {
        body: { prompt },
      });

      if (error) throw error;

      toast({
        title: "Event Generated!",
        description: "Your event has been generated successfully.",
      });
      console.log('Generated event:', data);
      setPromptCount(prev => prev + 1);

    } catch (error) {
      console.error('Error generating event:', error);
      toast({
        title: "Error",
        description: "Failed to generate event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-down mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            Welcome to Your AI Event Planner
          </h1>
          <p className="animate-fade-up mb-12 text-lg text-gray-600">
            Create, discover, and experience amazing events. Start your journey with us today.
          </p>

          <div className="animate-fade-up mb-6 space-y-4">
            <div className="relative mx-auto max-w-2xl">
              <Textarea
                placeholder="Describe your event idea... (e.g., 'Create a summer music festival in Central Park with local bands and food trucks')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] resize-none rounded-xl border-gray-200 p-4 text-base shadow-sm focus:border-primary focus:ring-primary"
              />
              <Button
                onClick={handlePromptSubmit}
                size="sm"
                className="absolute bottom-4 right-4 gap-2 bg-primary/80 hover:bg-primary/90"
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

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/discover")}
              className="animate-fade-up gap-2 bg-primary/80 hover:bg-primary/90"
              size="lg"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/create-event")}
              variant="outline"
              className="animate-fade-up bg-blue-300/40 text-black hover:bg-blue-400/70 border-0"
              size="lg"
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Up to Continue</DialogTitle>
            <DialogDescription>
              Create an account to generate unlimited AI events and access more features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up as Individual
            </Button>
            <Button
              onClick={() => navigate("/auth", { state: { type: 'business' } })}
              variant="outline"
              className="w-full gap-2 bg-blue-300/40 text-black hover:bg-blue-400/70 border-0"
            >
              <Building className="h-4 w-4" />
              Register as Business
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
