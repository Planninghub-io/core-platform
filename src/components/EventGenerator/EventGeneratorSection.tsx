
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventGeneratorForm } from "./EventGeneratorForm";
import { GeneratedEventCard } from "./GeneratedEventCard";
import { MissingInfoDialog } from "./MissingInfoDialog";
import { SignUpDialog } from "./SignUpDialog";
import { useEventGeneration } from "@/hooks/useEventGeneration";

export const EventGeneratorSection = () => {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    isGenerating,
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    missingInfo,
    generatedEvent,
    isCreating,
    additionalInfo,
    setAdditionalInfo,
    createdEventId,
    eventTitle,
    setEventTitle,
    handlePromptSubmit,
    handleCreateEvent,
  } = useEventGeneration();

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="animate-fade-down mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
          Welcome, what can I help you plan today
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
              eventTitle={eventTitle}
              onTitleChange={setEventTitle}
            />
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate("/discover")}
            className="animate-fade-up gap-2 bg-[#8b73f4] hover:bg-[#8b73f4]/90"
            size="lg"
          >
            Explore Events
            <ArrowRight className="h-4 w-4" />
          </Button>
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
    </div>
  );
};
