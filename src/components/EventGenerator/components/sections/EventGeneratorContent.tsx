
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
  const [currentModelProvider, setCurrentModelProvider] = useState<'openai' | 'anthropic'>(modelProvider);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  // Using an empty string as the welcome message to let ChatMessages component use its enhanced version
  const welcomeMessage = chatMessages.length === 0 ? "" : "";

  // Effect to track model changes
  useEffect(() => {
    console.log("EventGeneratorContent: Model provider changed to:", currentModelProvider);
  }, [currentModelProvider]);
  
  // Show the event form when we have a generated event
  useEffect(() => {
    if (generatedEvent) {
      console.log("EventGeneratorContent: Showing event form with generated event:", generatedEvent);
      setShowEventForm(true);
    }
  }, [generatedEvent]);

  // Handle prompt submission with the selected model
  const handleSubmit = (userPrompt: string, selectedModel?: 'openai' | 'anthropic') => {
    console.log("EventGeneratorContent: handleSubmit called with prompt:", userPrompt);
    console.log("EventGeneratorContent: handleSubmit called with model:", selectedModel || currentModelProvider);
    
    // Use the model selected in the UI component if provided, otherwise fall back to the state
    const modelToUse = selectedModel || currentModelProvider;
    
    // Update the current model if different
    if (selectedModel && selectedModel !== currentModelProvider) {
      setCurrentModelProvider(selectedModel);
      onModelChange(selectedModel);
    }
    
    // Clear prompt here as well to ensure it's cleared in all relevant places
    setPrompt("");
    
    // Submit the prompt if valid
    if (userPrompt && userPrompt.trim() !== "") {
      handlePromptSubmit(userPrompt, modelToUse);
    } else {
      console.error("EventGeneratorContent: Empty prompt submitted");
    }
  };

  return (
    <>
      <ChatInterface
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        promptCount={promptCount}
        handlePromptSubmit={handleSubmit}
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
