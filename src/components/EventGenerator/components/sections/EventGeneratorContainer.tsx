
import { EventGeneratorContent } from "./EventGeneratorContent";
import { WelcomeHeader } from "../WelcomeHeader";
import { ManualEventButton } from "../ManualEventButton";
import { useState, useEffect } from "react";
import { useEventGeneration } from "@/hooks/event-generation";
import { SignUpDialog } from "@/components/EventGenerator/SignUpDialog";
import { MissingInfoDialog } from "@/components/EventGenerator/MissingInfoDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventGeneratorContainerProps {
  onCreateManualEvent?: () => void;
}

export const EventGeneratorContainer = ({ onCreateManualEvent }: EventGeneratorContainerProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>('openai');
  const isMobile = useIsMobile();
  
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
    missingInfo
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

  // No need to show standalone welcome header since it's now in the chat interface
  // Only show manual event button when there are no chat messages
  return (
    <div className="container mx-auto px-2 sm:px-4 pt-0 pb-1 sm:pb-2 flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)]">
      <div className="mx-auto max-w-4xl w-full h-full flex flex-col">
        <div className="animate-fade-up flex-grow flex flex-col">
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

        {/* Bottom button with transparent background to ensure it doesn't cover content */}
        <div className="py-2 bg-gray-50/80 backdrop-blur-sm">
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
