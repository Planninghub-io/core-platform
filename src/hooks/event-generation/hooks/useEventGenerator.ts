
import { useState } from "react";
import { useEventGeneratorCore } from "./useEventGeneratorCore";
import { useEventCreationHandler } from "./useEventCreationHandler";
import { useMissingInfoHandler } from "./useMissingInfoHandler";
import { usePromptHandler } from "./usePromptHandler";
import { useEventRegenerationHandler } from "./useEventRegeneration";

export const useEventGenerator = () => {
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([]);
  const [waitingForBudget, setWaitingForBudget] = useState(false);

  // Request budget in chat function
  const requestBudgetInChat = () => {
    setWaitingForBudget(true);
    setChatMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content:
          "To provide a more accurate event plan, could you please specify your budget?",
      },
    ]);
  };

  // Event Generator Core Hook
  const {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    additionalInfo: coreAdditionalInfo,
    setAdditionalInfo: setCoreAdditionalInfo,
    generatedEvent,
    setGeneratedEvent,
    generateEvent: coreGenerateEvent,
    missingFields,
    previouslyRequestedFields
  } = useEventGeneratorCore(setChatMessages, waitingForBudget, requestBudgetInChat);

  // Event Creation Hook
  const {
    showSignUpDialog,
    setShowSignUpDialog,
    eventTitle,
    setEventTitle,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    handleCreateEvent
  } = useEventCreationHandler();

  // Missing Info Hook
  const {
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    additionalInfo,
    setAdditionalInfo,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit
  } = useMissingInfoHandler(setChatMessages, coreGenerateEvent);

  // Prompt Handler Hook
  const {
    prompt,
    setPrompt,
    handlePromptSubmit
  } = usePromptHandler(setChatMessages, coreGenerateEvent, setShowMissingInfoDialog, setGeneratedEvent);

  // Event Regeneration Hook
  const {
    isResubmitting,
    setIsResubmitting,
    regenerateEventWithUpdatedInfo
  } = useEventRegenerationHandler(setChatMessages, coreGenerateEvent, setGeneratedEvent);

  // Adapter for handleMissingInfoSubmit to match expected API
  const handleMissingInfoSubmitAdapter = async () => {
    await handleMissingInfoSubmit(missingInfo);
    setShowMissingInfoDialog(false);
  };

  // Wrapper for coreGenerateEvent that handles the modelProvider parameter
  const generateEventWrapper = (prompt: string, modelProvider?: 'openai' | 'anthropic', additionalInfo?: Record<string, string>) => {
    // Convert modelProvider to additionalInfo if provided
    const combinedInfo: Record<string, string> = {
      ...(additionalInfo || {}),
      // Add model preference if provided
      ...(modelProvider ? { modelPreference: modelProvider } : {})
    };
    
    return coreGenerateEvent(prompt, combinedInfo || {});
  };

  // Adapter for handleCreateEvent to match expected API
  const handleCreateEventAdapter = () => {
    return handleCreateEvent(generatedEvent);
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    missingInfo,
    generatedEvent,
    isCreating: false,
    createdEventId: null,
    eventTitle,
    setEventTitle,
    handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => {
      return handlePromptSubmit(prompt, modelProvider);
    },
    handleCreateEvent: handleCreateEventAdapter,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    hasMissingDate: missingFields?.includes("date") || false,
    hasMissingLocation: missingFields?.includes("location") || false,
    chatMessages,
    additionalInfo,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit: handleMissingInfoSubmitAdapter,
    waitingForBudget,
    setWaitingForBudget,
    isResubmitting,
    setIsResubmitting,
    generateEvent: generateEventWrapper,
    missingFields,
    regenerateEventWithUpdatedInfo
  };
};
