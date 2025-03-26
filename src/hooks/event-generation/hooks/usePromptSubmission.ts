
import { useState, useCallback } from "react";
import { useEventGeneratorCore } from "./useEventGeneratorCore";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";
import { ChatMessage } from "../types";

/**
 * Hook for handling prompt submission and event generation
 */
export const usePromptSubmission = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  const [prompt, setPrompt] = useState("");
  
  // Use the core event generation logic
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
    missingFields,
    previouslyRequestedFields
  } = useEventGeneratorCore(setChatMessages, waitingForBudget, requestBudgetInChat);
  
  /**
   * Handle prompt submission
   */
  const handlePromptSubmit = async (modelProvider: 'openai' | 'anthropic' = 'openai') => {
    // If prompt is empty, do nothing
    if (!prompt.trim()) {
      console.log("usePromptSubmission: Empty prompt, not submitting");
      return;
    }
    
    // Log debug info
    console.log("usePromptSubmission: Handling prompt submission:", prompt);
    console.log("usePromptSubmission: Using model provider:", modelProvider);
    
    // Store prompt before clearing
    const currentPrompt = prompt;
    
    // Clear the prompt immediately to prevent duplicate submissions
    setPrompt("");
    
    // Add the prompt as a user message to the chat
    setChatMessages((prev) => [
      ...prev,
      { type: "user", content: currentPrompt },
    ]);

    // Show loading message
    setChatMessages((prev) => [
      ...prev,
      { type: "ai", content: "Generating your event details..." },
    ]);

    try {
      // Generate the event
      console.log("usePromptSubmission: Calling generateEvent");
      const response = await generateEvent(currentPrompt, modelProvider);
      console.log("usePromptSubmission: Response received:", response);

      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      if (response.error) {
        // Display error message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createErrorMessage() },
        ]);
        console.error("Error in event generation:", response.error);
      } else if ('needsBudget' in response && response.needsBudget) {
        // Budget request is handled separately
        console.log("Need budget information");
      } else if ('missing' in response && response.missing && response.missing.length > 0) {
        // Display missing info message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: "I need more information to generate this event. Can you please provide the missing details?" },
        ]);
        console.log("Missing information:", response.missing);
      } else if ('validatedEvent' in response && response.validatedEvent) {
        // Display generated event
        setGeneratedEvent(response.validatedEvent);
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createAIMessage(response.validatedEvent) },
        ]);
        console.log("Generated event:", response.validatedEvent);
      } else {
        // If no valid data received
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createErrorMessage() },
        ]);
        console.error("Invalid response from event generation");
      }
    } catch (error: any) {
      console.error('Error generating event:', error);
      
      // Remove loading message and add error message
      setChatMessages((prev) => prev.slice(0, -1));
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
    }
  };

  return {
    prompt,
    setPrompt,
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
    handlePromptSubmit,
    missingFields,
    previouslyRequestedFields
  };
};
