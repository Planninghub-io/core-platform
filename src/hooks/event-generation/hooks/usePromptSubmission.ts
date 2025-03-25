
import { useState, useCallback } from "react";
import { useEventGeneratorCore } from "./useEventGeneratorCore";
import { createErrorMessage } from "../utils/chatMessageUtils";
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
   * Generate an event based on a prompt
   */
  const generateEventWithPrompt = async (
    prompt: string,
    modelProvider: 'openai' | 'anthropic' = 'openai'
  ) => {
    // Add the prompt as a user message to the chat
    setChatMessages((prev) => [
      ...prev,
      { type: "user", content: prompt },
    ]);

    // Show loading message
    setChatMessages((prev) => [
      ...prev,
      { type: "ai", content: "Generating your event details..." },
    ]);

    try {
      // Generate the event
      const response = await generateEvent(prompt, modelProvider);

      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      if (response.error) {
        // Display error message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createErrorMessage() },
        ]);
        return { error: response.error };
      }

      // Type guard to check for specific properties
      if ('needsBudget' in response) {
        return response;
      }

      if ('missing' in response && response.missing && response.missing.length > 0) {
        // Display missing info message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: "I need more information to generate this event. Can you please provide the missing details?" },
        ]);
        return response;
      }

      if ('validatedEvent' in response && response.validatedEvent) {
        // Display generated event
        setGeneratedEvent(response.validatedEvent);
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: "Here is the event I generated for you:" },
        ]);
        return response;
      }

      // If no valid data received
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
      
      return { error: new Error("Invalid response from event generation") };

    } catch (error: any) {
      console.error('Error generating event:', error);
      
      // Add error message to chat
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
      
      return { error };
    }
  };

  /**
   * Handle prompt submission
   */
  const handlePromptSubmit = (modelProvider: 'openai' | 'anthropic' = 'openai') => {
    // If prompt is empty, do nothing
    if (!prompt.trim()) return;
    
    // Log debug info
    console.log("Handling prompt submission:", prompt);
    console.log("Using model provider:", modelProvider);
    
    // Start event generation
    generateEventWithPrompt(prompt, modelProvider);
    
    // Reset the prompt
    setPrompt("");
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
    previouslyRequestedFields,
    generateEventWithPrompt
  };
};
