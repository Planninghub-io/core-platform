
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventGeneratorForm } from "./EventGeneratorForm";
import { GeneratedEventCard } from "./GeneratedEventCard";
import { SignUpDialog } from "./SignUpDialog";
import { useEventGeneration } from "@/hooks/event-generation";
import { ChatMessage } from "./ChatMessage";

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
    chatMessages
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
        {chatMessages.length === 0 && (
          <div className="text-center mb-10">
            <h1 className="animate-fade-down mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              What can I help you plan today?
            </h1>
            <p className="animate-fade-up mb-8 text-lg text-gray-600">
              Create, discover, and experience amazing events. Start your journey with us today.
            </p>
          </div>
        )}

        <div className="animate-fade-up space-y-4">
          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {/* Chat Messages */}
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {welcomeMessage && (
                <ChatMessage
                  key="welcome"
                  message={welcomeMessage}
                  type="ai"
                  isLoading={false}
                  isWelcomeMessage={true}
                />
              )}
              
              {chatMessages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message.content} 
                  type={message.type} 
                  isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
                />
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                {chatMessages.length === 0 ? (
                  <EventGeneratorForm
                    prompt={prompt}
                    isGenerating={isGenerating}
                    promptCount={promptCount}
                    onPromptChange={setPrompt}
                    onSubmit={handlePromptSubmit}
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                          e.preventDefault();
                          handlePromptSubmit();
                        }
                      }}
                      className="flex-1 rounded-md border border-gray-300 py-3 px-4"
                      placeholder="Type your message..."
                      disabled={isGenerating || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai')}
                    />
                    <Button 
                      onClick={handlePromptSubmit} 
                      disabled={isGenerating || !prompt.trim() || (generatedEvent && chatMessages[chatMessages.length - 1]?.type === 'ai')}
                      size="icon"
                      className="h-12 w-12 rounded-full bg-[#8b73f4] hover:bg-[#8b73f4]/90"
                    >
                      {isGenerating ? (
                        <Sparkles className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

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

        {/* Create Manual Event Button */}
        {chatMessages.length === 0 && (
          <div className="mt-10 flex justify-center">
            <Button
              onClick={onCreateManualEvent || (() => navigate("/create-event"))}
              className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90"
              size="lg"
            >
              Create event on my own
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          onSignUpIndividual={() => handleSignUp('user')}
          onSignUpBusiness={() => handleSignUp('business')}
          eventData={prepareEventData()}
        />
      </div>
    </div>
  );
};
