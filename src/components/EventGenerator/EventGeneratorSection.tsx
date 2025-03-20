
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GeneratedEventCard } from "./GeneratedEventCard";
import { SignUpDialog } from "./SignUpDialog";
import { useEventGeneration } from "@/hooks/event-generation";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { ChatInterface } from "./components/ChatInterface";
import { ManualEventButton } from "./components/ManualEventButton";
import { MissingInfoDialog } from "./MissingInfoDialog";
import { EventDetailsForm } from "./components/EventDetailsForm";

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
    handleMissingInfoSubmit,
    waitingForBudget,
    setWaitingForBudget
  } = useEventGeneration();

  // Get the latest user prompt from chat messages
  const getLatestUserPrompt = () => {
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].type === 'user') {
        return chatMessages[i].content;
      }
    }
    return prompt;
  };

  // Get the latest user prompt
  const latestPrompt = getLatestUserPrompt();

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
      
      // Log what data we're passing to manual event creation
      console.log("Creating manual event with data from chat:", eventData);
    }

    // Navigate to create-event with the collected data
    navigate("/create-event", { state: { eventData } });
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

          {/* Generated Event Data */}
          {generatedEvent && (
            <div className="space-y-6">
              {/* Display event image */}
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={generatedEvent.imageUrl || "/placeholder.svg"}
                  alt={eventTitle || generatedEvent.title || "Event"}
                  className="w-full h-[200px] object-cover animate-fade-in rounded-lg"
                />
              </div>
              
              {/* Show event details form for editing */}
              <EventDetailsForm 
                event={generatedEvent}
                eventTitle={eventTitle}
                setEventTitle={setEventTitle}
                selectedDate={selectedDate || generatedEvent.date}
                setSelectedDate={setSelectedDate}
                location={location || generatedEvent.location}
                setLocation={setLocation}
                hasMissingDate={hasMissingDate}
                hasMissingLocation={hasMissingLocation}
                isCreating={isCreating}
                handleCreateEvent={handleCreateEvent}
                prompt={latestPrompt}
              />
            </div>
          )}
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
};
