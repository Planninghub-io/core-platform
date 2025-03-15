
import { useState } from "react";
import { useEventCreation } from "@/hooks/useEventCreation";
import { useGenerateEventAI } from "./useGenerateEventAI";
import { usePromptSubmission } from "./usePromptSubmission";
import { useEventCreationHandler } from "./useEventCreation";
import { EventGenerationHookReturn } from "./types/hook-types";

export const useEventGeneration = (): EventGenerationHookReturn => {
  const { createEvent, isCreating, createdEventId, showSignUpDialog, setShowSignUpDialog } = useEventCreation();
  const {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    additionalInfo,
    setAdditionalInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    generateEvent,
    chatMessages,
    setChatMessages,
    missingFields
  } = useGenerateEventAI();

  const [prompt, setPrompt] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  
  // Check if date or location is missing
  const hasMissingDate = missingFields?.includes('date') || !selectedDate && !generatedEvent?.date;
  const hasMissingLocation = missingFields?.includes('location') || !location && !generatedEvent?.location;

  // Use the prompt submission hook
  const { handlePromptSubmit } = usePromptSubmission(
    prompt,
    setPrompt,
    promptCount,
    setShowSignUpDialog,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    chatMessages,
    setChatMessages,
    generateEvent,
    isResubmitting
  );

  // Use the event creation hook
  const { handleCreateEvent } = useEventCreationHandler(
    generatedEvent,
    eventTitle,
    hasMissingDate,
    selectedDate,
    hasMissingLocation,
    location,
    additionalInfo,
    createEvent
  );

  return {
    prompt,
    setPrompt,
    isGenerating,
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    missingInfo,
    generatedEvent,
    isCreating,
    additionalInfo,
    setAdditionalInfo,
    createdEventId,
    eventTitle,
    setEventTitle,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    hasMissingDate,
    hasMissingLocation,
    handlePromptSubmit,
    handleCreateEvent,
    chatMessages,
    setChatMessages,
    missingFields
  };
};
