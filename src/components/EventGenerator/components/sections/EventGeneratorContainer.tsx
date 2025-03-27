
import { EventGeneratorContent } from "./EventGeneratorContent";
import { WelcomeHeader } from "../WelcomeHeader";
import { ManualEventButton } from "../ManualEventButton";
import { SignUpDialog } from "../../SignUpDialog";
import { MissingInfoDialog } from "../../MissingInfoDialog";
import { useEventGeneration } from "@/hooks/event-generation";
import { useState, useEffect } from "react";

interface EventGeneratorContainerProps {
  onCreateManualEvent?: () => void;
}

export const EventGeneratorContainer = ({ onCreateManualEvent }: EventGeneratorContainerProps) => {
  const [modelProvider, setModelProvider] = useState<'openai'>('openai');
  
  const {
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    missingInfo,
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

  // Debug effect to check if we have a generated event
  useEffect(() => {
    if (generatedEvent) {
      console.log("EventGeneratorContainer: Generated event available:", generatedEvent);
    }
  }, [generatedEvent]);

  // Get the latest user prompt from chat messages
  const getLatestUserPrompt = () => {
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].type === 'user') {
        return chatMessages[i].content;
      }
    }
    return "";
  };

  // Get the latest user prompt
  const latestPrompt = getLatestUserPrompt();

  // Prepare event data for navigation
  const prepareEventData = () => {
    if (!generatedEvent) return null;
    
    return {
      ...generatedEvent,
      title: eventTitle || generatedEvent.title,
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location
    };
  };

  // Handle model change
  const handleModelChange = (model: 'openai') => {
    setModelProvider(model);
    console.log("Model changed to:", model);
  };

  // Handle manual event creation with populated data
  const handleManualEventCreation = () => {
    // Prepare event data based on chat information
    let eventData = {};
    
    if (generatedEvent) {
      // If we have a generated event, use that data
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
      // If no generated event yet, but user has entered some data in chat
      // Extract information from chat messages or additional info
      eventData = {
        ...(additionalInfo.date && { date: additionalInfo.date }),
        ...(additionalInfo.location && { location: additionalInfo.location }),
        ...(additionalInfo.budget && { budget: additionalInfo.budget })
      };
    }
    
    // Navigate to create-event with the collected data
    window.location.href = "/create-event";
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
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
          />
        </div>

        <ManualEventButton 
          show={chatMessages.length === 0} 
          onClick={onCreateManualEvent || handleManualEventCreation} 
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

  // Redirect to authentication with event data
  function handleSignUp(type: 'business' | 'user') {
    setShowSignUpDialog(false);
    const eventData = prepareEventData();
    window.location.href = `/auth?type=${type}&redirectPath=/create-event`;
  }
};
