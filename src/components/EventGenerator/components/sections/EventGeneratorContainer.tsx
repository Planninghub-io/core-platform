
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
  const [showAgent, setShowAgent] = useState(false);

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
    // Show the agent instead of redirecting when there's a prompt
    if (latestPrompt) {
      setShowAgent(true);
      return;
    }
    
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
    
    if (onCreateManualEvent) {
      onCreateManualEvent();
    } else {
      window.location.href = "/create-event";
    }
  };

  const showSignUpPrompt = promptCount >= 1 && !generatedEvent;

  // Optimize container height and give more space for the embedded chat
  const containerClass = isMobile 
    ? "container mx-auto px-2 pt-0 pb-1 flex flex-col h-[calc(100vh-100px)]" 
    : "container mx-auto px-4 pt-0 pb-2 flex flex-col h-auto min-h-[calc(100vh-130px)]";

  return (
    <div className={containerClass}>
      <div className="mx-auto max-w-4xl w-full h-full flex flex-col">
        {/* Only show standalone welcome header when there are no messages */}
        {chatMessages.length === 0 && <WelcomeHeader show={true} />}

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

        {/* Bottom section with transparent background */}
        <div className="py-2 bg-gray-50/80 backdrop-blur-sm">
          <ManualEventButton 
            show={chatMessages.length === 0 || showAgent} 
            onClick={handleManualEventCreation} 
            eventPrompt={showAgent ? latestPrompt : undefined}
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
