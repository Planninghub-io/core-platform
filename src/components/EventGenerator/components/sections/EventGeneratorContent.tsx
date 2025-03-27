
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
  modelProvider: 'openai';
  onModelChange: (model: 'openai') => void;
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
  const [currentModelProvider, setCurrentModelProvider] = useState<'openai'>(modelProvider);

  // Using an empty string as the welcome message to let ChatMessages component use its enhanced version
  const welcomeMessage = chatMessages.length === 0 ? "" : "";

  // Effect to track model changes
  useEffect(() => {
    console.log("EventGeneratorContent: Model provider changed to:", currentModelProvider);
  }, [currentModelProvider]);
  
  // Debug event data
  useEffect(() => {
    if (generatedEvent) {
      console.log("EventGeneratorContent: Generated event available:", generatedEvent);
    }
  }, [generatedEvent]);

  return (
    <>
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
        modelProvider={currentModelProvider}
        onModelChange={(model) => {
          setCurrentModelProvider(model);
          onModelChange(model);
          console.log("EventGeneratorContent: Model changed to:", model);
        }}
        setSelectedDate={setSelectedDate}
        setLocation={setLocation}
      />

      {/* Generated Event Data - Show only after we have a generated event */}
      {generatedEvent && (
        <EventDetailsSection
          generatedEvent={generatedEvent}
          eventTitle={eventTitle || generatedEvent.title || "New Event"}
          setEventTitle={setEventTitle}
          selectedDate={selectedDate || generatedEvent.date}
          setSelectedDate={setSelectedDate}
          location={location || generatedEvent.location}
          setLocation={setLocation}
          hasMissingDate={hasMissingDate}
          hasMissingLocation={hasMissingLocation}
          isCreating={false}
          handleCreateEvent={handleCreateEvent}
          prompt={latestPrompt}
        />
      )}
    </>
  );
};
