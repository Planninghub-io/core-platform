import { EventGeneratorContent } from "./EventGeneratorContent";
import { WelcomeHeader } from "../WelcomeHeader";
import { ManualEventButton } from "../ManualEventButton";
import { useState, useEffect } from "react";
import { useEventGeneration } from "@/hooks/event-generation";

interface EventGeneratorContainerProps {
  onCreateManualEvent?: () => void;
}

export const EventGeneratorContainer = ({ onCreateManualEvent }: EventGeneratorContainerProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>('openai');
  
  const {
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    generatedEvent,
    eventTitle,
    setEventTitle,
    handleCreateEvent,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    hasMissingDate,
    hasMissingLocation,
    chatMessages,
    setChatMessages,
    additionalInfo,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit,
    waitingForBudget,
  } = useEventGeneration();

  const getLatestUserPrompt = () => {
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].type === 'user') {
        return chatMessages[i].content;
      }
    }
    return "";
  };

  const latestPrompt = getLatestUserPrompt();

  const prepareEventData = () => {
    if (!generatedEvent) return null;
    
    return {
      ...generatedEvent,
      title: eventTitle || generatedEvent.title,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    };
  };

  const handleModelChange = (model: 'openai' | 'anthropic') => {
    setModelProvider(model);
    console.log("Model changed to:", model);
  };

  const handleManualEventCreation = () => {
    let eventData = {};
    
    if (generatedEvent) {
      eventData = {
        title: eventTitle || generatedEvent.title,
        description: generatedEvent.description,
        date: selectedDate || generatedEvent.date,
        location: location || generatedEvent.location,
        budget: generatedEvent.estimatedPrice,
        eventType: generatedEvent.category,
        imageUrl: generatedEvent.imageUrl
      };
    } else {
      eventData = {
        ...(additionalInfo.date && { date: additionalInfo.date }),
        ...(additionalInfo.location && { location: additionalInfo.location }),
        ...(additionalInfo.budget && { budget: additionalInfo.budget })
      };
    }
    
    window.location.href = "/create-event";
  };

  const showSignUpPrompt = promptCount >= 1 && !generatedEvent;

  useEffect(() => {
    if (generatedEvent) {
      console.log("EventGeneratorContainer: Generated event available:", JSON.stringify(generatedEvent, null, 2));
    } else {
      console.log("EventGeneratorContainer: No generated event available");
    }
  }, [generatedEvent]);

  return (
    <div className="container py-4 sm:py-6">
      <div className="mx-auto max-w-4xl">
        <WelcomeHeader show={chatMessages.length === 0} />

        <div className="animate-fade-up space-y-4">
          <EventGeneratorContent 
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            generatedEvent={generatedEvent}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            location={location}
            setLocation={setLocation}
            hasMissingDate={hasMissingDate}
            hasMissingLocation={hasMissingLocation}
            handleCreateEvent={handleCreateEvent}
            latestPrompt={latestPrompt}
            modelProvider={modelProvider}
            onModelChange={handleModelChange}
            promptCount={promptCount}
            showSignUpPrompt={showSignUpPrompt}
          />
        </div>

        <div className="mt-4">
          <ManualEventButton 
            show={chatMessages.length === 0} 
            onClick={onCreateManualEvent || handleManualEventCreation} 
          />
        </div>

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

  function handleSignUp(type: 'business' | 'user') {
    setShowSignUpDialog(false);
    const eventData = prepareEventData();
    window.location.href = `/auth?type=${type}&redirectPath=/create-event`;
  }
};
