
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handlePromptSubmit = () => {
    // TODO: Handle prompt submission
    console.log("Prompt submitted:", prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-down mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            Welcome to Your Event Platform
          </h1>
          <p className="animate-fade-up mb-8 text-lg text-gray-600">
            Create, discover, and experience amazing events. Start your journey with us today.
          </p>
          <div className="animate-fade-up mb-6 space-y-4">
            <div className="relative mx-auto max-w-2xl">
              <Textarea
                placeholder="Describe your event idea... (e.g., 'Create a summer music festival in Central Park with local bands and food trucks')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl border-gray-200 p-4 text-base shadow-sm focus:border-primary focus:ring-primary"
              />
              <Button
                onClick={handlePromptSubmit}
                size="sm"
                className="absolute bottom-4 right-4 gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/discover")}
              className="animate-fade-up gap-2"
              size="lg"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/create-event")}
              variant="outline"
              className="animate-fade-up"
              size="lg"
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
