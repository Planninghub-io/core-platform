
import { useState } from "react";
import { MissingInfo, ChatMessage } from "./types";
import { useEventGenerator } from "./hooks/useEventGenerator";
import { useBudgetHandler } from "./hooks/useBudgetHandler";

export const useGenerateEventAI = () => {
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  
  // Use the budget handler hook
  const {
    waitingForBudget,
    setWaitingForBudget,
    requestBudgetInChat
  } = useBudgetHandler(chatMessages, setChatMessages, additionalInfo, setAdditionalInfo);

  // Use the event generator hook
  const {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    generateEvent,
    missingFields,
    regenerateEventWithUpdatedInfo
  } = useEventGenerator(chatMessages, setChatMessages, waitingForBudget, requestBudgetInChat);

  return {
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
    missingFields,
    waitingForBudget,
    setWaitingForBudget,
    regenerateEventWithUpdatedInfo
  };
};
