
import { useState, useCallback, useEffect } from "react";
import { ChatMessage } from "../types";
import { usePromptSubmission } from "./usePromptSubmission";

/**
 * Core hook for handling event generation
 */
export const useEventGeneratorCore = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  const [missingInfo, setMissingInfo] = useState<any>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);
  
  // Use the prompt submission hook
  const {
    isGenerating,
    promptCount,
    generatedEvent,
    setGeneratedEvent,
    isResubmitting,
    setIsResubmitting,
    missingFields,
    handlePromptSubmit
  } = usePromptSubmission(
    setChatMessages,
    waitingForBudget,
    requestBudgetInChat
  );

  // Log when generated event changes
  useEffect(() => {
    if (generatedEvent) {
      console.log("useEventGeneratorCore: Generated event updated:", generatedEvent);
    }
  }, [generatedEvent]);

  // Wrapper around handlePromptSubmit
  const generateEvent = useCallback(async (
    prompt: string, 
    modelProvider: 'openai' | 'anthropic' = 'openai',
    providedInfo: Record<string, string> = {}
  ) => {
    const combinedInfo = {
      ...additionalInfo,
      ...providedInfo
    };

    console.log("useEventGeneratorCore: Calling handlePromptSubmit with prompt:", prompt);
    console.log("useEventGeneratorCore: Additional info:", combinedInfo);
    
    return handlePromptSubmit(prompt, modelProvider, combinedInfo);
  }, [
    handlePromptSubmit, 
    additionalInfo
  ]);
  
  return {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    additionalInfo,
    setAdditionalInfo,
    generatedEvent,
    setGeneratedEvent,
    isResubmitting, 
    setIsResubmitting,
    generateEvent,
    missingFields,
    previouslyRequestedFields,
    setPreviouslyRequestedFields
  };
};
