
import { ChatInterface } from "../ChatInterface";
import { EventDetailsSection } from "./EventDetailsSection";
import { useEventGeneration } from "@/hooks/event-generation";
import { useState, useEffect } from "react";

interface EventGeneratorContentProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string }>>>;
  generatedEvent: any | null;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  handleCreateEvent: () => void;
  latestPrompt: string;
  modelProvider: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
  promptCount: number;
}

export const EventGeneratorContent = ({
  chatMessages,
  setChatMessages,
  generatedEvent,
  eventTitle,
  setEventTitle,
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  hasMissingDate,
  hasMissingLocation,
  handleCreateEvent,
  latestPrompt,
  modelProvider,
  onModelChange,
  promptCount
}: EventGeneratorContentProps) => {
  const { prompt, setPrompt, isGenerating, handlePromptSubmit } = useEventGeneration();
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Show event details when an event is generated
  useEffect(() => {
    if (generatedEvent) {
      setShowEventDetails(true);
      
      // Pre-populate event title if not already set
      if (!eventTitle && generatedEvent.title) {
        setEventTitle(generatedEvent.title);
      }
    }
  }, [generatedEvent, eventTitle, setEventTitle]);

  // Using an empty string as the welcome message to let ChatMessages component use its enhanced version
  const welcomeMessage = "";

  return (
    <div className="w-full">
      {/* Full width container for chat interface */}
      <div className="w-full mb-6">
        <ChatInterface
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          promptCount={promptCount}
          handlePromptSubmit={handlePromptSubmit}
          welcomeMessage={welcomeMessage}
          generatedEvent={generatedEvent}
          setSelectedDate={setSelectedDate}
          setLocation={setLocation}
          modelProvider={modelProvider}
          onModelChange={onModelChange}
        />
      </div>
      
      {/* Only show event details section when an event is generated */}
      {showEventDetails && generatedEvent && (
        <div className="w-full">
          <EventDetailsSection
            generatedEvent={generatedEvent}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            location={location}
            setLocation={setLocation}
            hasMissingDate={hasMissingDate}
            hasMissingLocation={hasMissingLocation}
            isCreating={false}
            handleCreateEvent={handleCreateEvent}
            prompt={latestPrompt}
          />
        </div>
      )}
    </div>
  );
};
