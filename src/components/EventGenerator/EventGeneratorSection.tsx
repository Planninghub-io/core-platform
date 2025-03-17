
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GeneratedEventCard } from "./GeneratedEventCard";
import { SignUpDialog } from "./SignUpDialog";
import { useEventGeneration } from "@/hooks/event-generation";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { ChatInterface } from "./components/ChatInterface";
import { ManualEventButton } from "./components/ManualEventButton";
import { MissingInfoDialog } from "./MissingInfoDialog";

interface EventGeneratorSectionProps {
  onCreateManualEvent?: () => void;
}

export const EventGeneratorSection = ({ onCreateManualEvent }: EventGeneratorSectionProps) => {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    isGenerating,
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    missingInfo,
    generatedEvent,
    isCreating,
    createdEventId,
    eventTitle,
    setEventTitle,
    handlePromptSubmit,
    handleCreateEvent,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    hasMissingDate,
    hasMissingLocation,
    chatMessages,
    additionalInfo,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit
  } = useEventGeneration();

  // Prepare event data for navigation
  const prepareEventData = () => {
    if (!generatedEvent) return null;
    
    return {
      ...generatedEvent,
      title: eventTitle,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    };
  };

  // Redirect to authentication with event data
  const handleSignUp = (type: 'business' | 'user') => {
    setShowSignUpDialog(false);
    const eventData = prepareEventData();
    navigate("/auth", { 
      state: { 
        type, 
        eventData,
        redirectPath: "/create-event" 
      } 
    });
  };

  // Updated welcome message
  const welcomeMessage = chatMessages.length === 0 ? 
    "Hi, please provide your event details including place, date & time to get started with planning." : "";

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <WelcomeHeader show={chatMessages.length === 0} />

        <div className="animate-fade-up space-y-4">
          <ChatInterface
            chatMessages={chatMessages}
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            promptCount={promptCount}
            handlePromptSubmit={handlePromptSubmit}
            welcomeMessage={welcomeMessage}
            generatedEvent={generatedEvent}
          />

          {/* Generated Event Card */}
          {generatedEvent && (
            <GeneratedEventCard
              event={{
                ...generatedEvent,
                date: selectedDate || generatedEvent.date,
                location: location || generatedEvent.location
              }}
              isCreating={isCreating}
              eventId={createdEventId || undefined}
              imageUrl={createdEventId ? `/api/events/${createdEventId}/image` : undefined}
              onCreateEvent={handleCreateEvent}
              eventTitle={eventTitle}
              onTitleChange={setEventTitle}
              onDateChange={setSelectedDate}
              onLocationChange={setLocation}
              selectedDate={selectedDate}
              missingDate={hasMissingDate}
              missingLocation={hasMissingLocation}
            />
          )}
        </div>

        <ManualEventButton 
          show={chatMessages.length === 0} 
          onClick={onCreateManualEvent || (() => navigate("/create-event"))} 
        />

        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          onSignUpIndividual={() => handleSignUp('user')}
          onSignUpBusiness={() => handleSignUp('business')}
          eventData={prepareEventData()}
        />

        <MissingInfoDialog
          open={showMissingInfoDialog}
          onOpenChange={setShowMissingInfoDialog}
          missingInfo={missingInfo}
          additionalInfo={additionalInfo}
          onAdditionalInfoChange={handleAdditionalInfoChange}
          onSubmit={handleMissingInfoSubmit}
        />
      </div>
    </div>
  );
};
