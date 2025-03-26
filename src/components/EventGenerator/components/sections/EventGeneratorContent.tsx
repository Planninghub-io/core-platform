
import { ChatInterface } from "../ChatInterface";
import { EventDetailsSection } from "./EventDetailsSection";
import { useEventGeneration } from "@/hooks/event-generation";
import { useState, useEffect } from "react";

interface EventGeneratorContentProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
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

  // Updated welcome message
  const welcomeMessage = chatMessages.length === 0 ? 
    "Hi, please provide your event details including place, date & time to get started with planning." : "";

  // Effect to track model changes
  useEffect(() => {
    console.log("EventGeneratorContent: Model provider changed to:", currentModelProvider);
  }, [currentModelProvider]);

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
      />

      {/* Generated Event Data */}
      {generatedEvent && (
        <EventDetailsSection
          generatedEvent={generatedEvent}
          eventTitle={eventTitle}
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
