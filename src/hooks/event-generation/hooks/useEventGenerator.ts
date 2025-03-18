
import { ChatMessage } from "../types";
import { useEventGeneratorCore } from "./useEventGeneratorCore";
import { useEventRegeneration } from "./useEventRegeneration";

/**
 * Main hook for event generation 
 */
export const useEventGenerator = (
  chatMessages: ChatMessage[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  // Use core event generation functionality
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
    missingFields
  } = useEventGeneratorCore(setChatMessages, waitingForBudget, requestBudgetInChat);

  // Use event regeneration functionality
  const { regenerateEventWithUpdatedInfo } = useEventRegeneration(chatMessages, generateEvent);

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
    missingFields,
    regenerateEventWithUpdatedInfo
  };
};
