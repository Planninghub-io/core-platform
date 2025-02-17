import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventGeneratorForm } from "@/components/EventGenerator/EventGeneratorForm";
import { GeneratedEventCard } from "@/components/EventGenerator/GeneratedEventCard";
import { MissingInfoDialog } from "@/components/EventGenerator/MissingInfoDialog";
import { SignUpDialog } from "@/components/EventGenerator/SignUpDialog";

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
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

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
        const prePopulatedInfo: Record<string, string> = {};
        
        const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
        const dateTimeMatch = prompt.match(dateTimeRegex);
        
        const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
        const locationMatch = prompt.match(locationRegex);

        if (dateTimeMatch && data.missingFields.includes('date')) {
          prePopulatedInfo.date = dateTimeMatch[1];
        }
        
        if (locationMatch && (data.missingFields.includes('location') || data.missingFields.includes('city'))) {
          const locationField = data.missingFields.includes('location') ? 'location' : 'city';
          prePopulatedInfo.location = locationMatch[1];
        }

        setAdditionalInfo(prePopulatedInfo);
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

  const handleCreateEvent = async () => {
    if (!generatedEvent) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setShowSignUpDialog(true);
      return;
    }

    setIsCreating(true);
    try {
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-event-image', {
        body: { prompt: generatedEvent.imagePrompt },
      });

      if (imageError) throw imageError;

      const priceString = generatedEvent.estimatedPrice.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceString) || 0;

      const { data, error } = await supabase.from('events').insert({
        title: generatedEvent.title,
        description: generatedEvent.description,
        date: new Date(generatedEvent.date).toISOString(),
        end_date: new Date(new Date(generatedEvent.date).getTime() + (2 * 60 * 60 * 1000)).toISOString(),
        location: generatedEvent.location,
        category: generatedEvent.category,
        price: price,
        user_id: userData.user.id,
        status: 'upcoming',
        image_url: imageData?.image_url
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event created successfully.",
      });
      
      setCreatedEventId(data.id);

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
            <EventGeneratorForm
              prompt={prompt}
              isGenerating={isGenerating}
              promptCount={promptCount}
              onPromptChange={setPrompt}
              onSubmit={handlePromptSubmit}
            />

            {generatedEvent && (
              <GeneratedEventCard
                event={generatedEvent}
                isCreating={isCreating}
                eventId={createdEventId || undefined}
                imageUrl={createdEventId ? `/api/events/${createdEventId}/image` : undefined}
                onCreateEvent={handleCreateEvent}
              />
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

      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
        onSignUpIndividual={() => navigate("/auth")}
        onSignUpBusiness={() => navigate("/auth", { state: { type: 'business' } })}
      />

      <MissingInfoDialog
        open={showMissingInfoDialog}
        onOpenChange={setShowMissingInfoDialog}
        missingInfo={missingInfo}
        additionalInfo={additionalInfo}
        onAdditionalInfoChange={(field, value) => 
          setAdditionalInfo(prev => ({ ...prev, [field]: value }))
        }
        onSubmit={() => {
          setShowMissingInfoDialog(false);
          handlePromptSubmit();
        }}
      />
    </div>
  );
};

export default Index;
