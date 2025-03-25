
import { useState } from "react";
import { ChatMessage, GeneratedEvent } from "../types";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";

export const useEventRegenerationHandler = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  coreGenerateEvent: (prompt: string, modelProvider: 'openai' | 'anthropic', additionalInfo?: Record<string, string>) => Promise<any>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<GeneratedEvent | null>>
) => {
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Regenerate event with updated info
  const regenerateEventWithUpdatedInfo = async (
    updatedPrompt: string,
    updatedModelProvider: 'openai' | 'anthropic' = 'openai',
    additionalInfo: Record<string, string> = {}
  ) => {
    setIsResubmitting(true);

    // Add the updated prompt as a user message to the chat
    setChatMessages((prev) => [
      ...prev,
      { type: "user", content: updatedPrompt },
    ]);

    // Show loading message
    setChatMessages((prev) => [
      ...prev,
      { type: "ai", content: "Regenerating event details..." },
    ]);

    try {
      // Generate the event
      const response = await coreGenerateEvent(updatedPrompt, updatedModelProvider, additionalInfo);

      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      if (response.error) {
        // Display error message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createErrorMessage() },
        ]);
        return null;
      }

      // Type guard to ensure we're handling properties correctly
      if ('validatedEvent' in response && response.validatedEvent) {
        // Display success message
        setGeneratedEvent(response.validatedEvent);
        setChatMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: createAIMessage(response.validatedEvent),
          },
        ]);
        return response;
      }
      
      return null;
    } catch (error) {
      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      // Display error message
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
      
      return null;
    } finally {
      setIsResubmitting(false);
    }
  };

  return {
    isResubmitting,
    setIsResubmitting,
    regenerateEventWithUpdatedInfo
  };
};
