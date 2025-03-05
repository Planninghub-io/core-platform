
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    chatMessages
  } = useEventGeneration();

  // Prepare event data for navigation
  const prepareEventData = () => {
    if (!generatedEvent) return null;
    
    return {
      ...generatedEvent,
      title: eventTitle,
      date: selectedDate || generatedEvent.date
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
          <EventGeneratorForm
            prompt={prompt}
            isGenerating={isGenerating}
            promptCount={promptCount}
            onPromptChange={setPrompt}
            onSubmit={handlePromptSubmit}
          />

          {/* Chat Messages Section */}
          {chatMessages.length > 0 && (
            <div className="mt-6 mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message.content} 
                    type={message.type} 
                    isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
                  />
                ))}
              </div>
              
              {/* Add a simple form for chat responses when we're waiting for user input */}
              {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai' && !generatedEvent && (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 p-2"
                    placeholder="Type your response..."
                  />
                  <Button 
                    onClick={handlePromptSubmit} 
                    disabled={isGenerating}
                    size="sm"
                    className="gap-2 bg-[#8b73f4] hover:bg-[#8b73f4]/90"
                  >
                    <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
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
                date: selectedDate || generatedEvent.date
              }}
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
