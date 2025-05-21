
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
  showSignUpPrompt: boolean;
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
  promptCount,
  showSignUpPrompt
}: EventGeneratorContentProps) => {
  const { prompt, setPrompt, isGenerating, handlePromptSubmit } = useEventGeneration();
  
  // Pre-populate event title if not already set
  useEffect(() => {
    if (generatedEvent && !eventTitle && generatedEvent.title) {
      console.log("EventGeneratorContent: Setting event title from generated event:", generatedEvent.title);
      setEventTitle(generatedEvent.title);
    }
    
    // Also pre-populate other fields if they're available but not set
    if (generatedEvent) {
      if (generatedEvent.date && !selectedDate) {
        setSelectedDate(generatedEvent.date);
      }
      if (generatedEvent.location && !location) {
        setLocation(generatedEvent.location);
      }
    }
  }, [generatedEvent, eventTitle, setEventTitle, selectedDate, setSelectedDate, location, setLocation]);

  // Using an empty string as the welcome message to let ChatMessages component use its enhanced version
  const welcomeMessage = "";

  return (
    <div className="w-full">
      {/* Full width container for chat interface with proper height to ensure chat input is visible */}
      <div className="w-full h-[calc(100vh-220px)] min-h-[500px]">
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
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          handleCreateEvent={handleCreateEvent}
          showSignUpPrompt={showSignUpPrompt}
        />
      </div>
    </div>
  );
};
