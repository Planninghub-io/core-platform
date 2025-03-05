
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventGeneratorForm } from "./EventGeneratorForm";
import { GeneratedEventCard } from "./GeneratedEventCard";
import { SignUpDialog } from "./SignUpDialog";
import { useEventGeneration } from "@/hooks/event-generation";
import { ChatMessage } from "./ChatMessage";

export const EventGeneratorSection = () => {
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
          {chatMessages.length === 0 && (
            <EventGeneratorForm
              prompt={prompt}
              isGenerating={isGenerating}
              promptCount={promptCount}
              onPromptChange={setPrompt}
              onSubmit={handlePromptSubmit}
            />
          )}

          {/* Chat Messages Section */}
          {chatMessages.length > 0 && (
            <div className="mt-6 mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-left">
              <h3 className="font-medium text-gray-700 mb-4 border-b pb-2">Event Planning Conversation</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4 pr-2">
                {chatMessages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message.content} 
                    type={message.type} 
                    isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
                  />
                ))}
              </div>
              
              {/* Chat response form */}
              {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai' && !generatedEvent && (
                <div className="mt-4 flex items-center gap-2 border-t pt-4">
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
                    className="flex-1 rounded-md border border-gray-300 p-2"
                    placeholder="Type your response..."
                  />
                  <Button 
                    onClick={handlePromptSubmit} 
                    disabled={isGenerating || !prompt.trim()}
                    size="sm"
                    className="gap-2 bg-[#8b73f4] hover:bg-[#8b73f4]/90"
                  >
                    {isGenerating ? (
                      <Sparkles className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              )}
            </div>
          )}

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

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate("/discover")}
            className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90"
            size="lg"
          >
            Explore Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

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
