import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Calendar, MapPin, Sparkles, Tag, UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

interface MissingInfo {
  needsInfo: true;
  missingFields: string[];
  message: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    if (promptCount >= 1) {
      setShowSignUpDialog(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedEvent(null);
    try {
      let fullPrompt = prompt;
      if (Object.keys(additionalInfo).length > 0) {
        const additionalDetails = Object.entries(additionalInfo)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
      }

      const { data, error } = await supabase.functions.invoke('generate-event', {
        body: { prompt: fullPrompt },
      });

      if (error) throw error;

      if (data.needsInfo) {
        setMissingInfo(data);
        setShowMissingInfoDialog(true);
        return;
      }

      setGeneratedEvent(data);
      setMissingInfo(null);
      setShowMissingInfoDialog(false);
      setAdditionalInfo({});
      
      toast({
        title: "Event Generated!",
        description: "Review the suggested event details below.",
      });
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

  const handleMissingInfoSubmit = () => {
    setShowMissingInfoDialog(false);
    handlePromptSubmit();
  };

  const handleCreateEvent = async () => {
    if (!generatedEvent) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setShowSignUpDialog(true);
      return;
    }

    setIsCreating(true);
    try {
      // Convert estimated price to number
      const priceString = generatedEvent.estimatedPrice.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceString) || 0;

      const { data, error } = await supabase.from('events').insert({
        title: generatedEvent.title,
        description: generatedEvent.description,
        date: new Date(generatedEvent.date).toISOString(),
        end_date: new Date(new Date(generatedEvent.date).getTime() + (2 * 60 * 60 * 1000)).toISOString(), // Default 2-hour duration
        location: generatedEvent.location,
        category: generatedEvent.category,
        price: price,
        user_id: userData.user.id,
        status: 'upcoming'
      }).select().single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Event created successfully.",
      });
      navigate(`/create-event`);
    } catch (error: any) {
      console.error('Detailed error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
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

            {generatedEvent && (
              <Card className="mt-6 text-left">
                <CardHeader>
                  <CardTitle>{generatedEvent.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(generatedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{generatedEvent.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {generatedEvent.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {generatedEvent.category}
                    </span>
                    <span>Starting from {generatedEvent.estimatedPrice}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCreateEvent}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? 'Creating Event...' : 'Create This Event'}
                  </Button>
                </CardFooter>
              </Card>
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

      <Dialog open={showMissingInfoDialog} onOpenChange={setShowMissingInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Additional Information Needed</DialogTitle>
            <DialogDescription>
              {missingInfo?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {missingInfo?.missingFields.map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  value={additionalInfo[field] || ""}
                  onChange={(e) => setAdditionalInfo(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleMissingInfoSubmit} className="w-full">
              Generate Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
