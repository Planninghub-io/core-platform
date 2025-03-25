
import { useState } from "react";
import { ChatMessage } from "../types";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";

export const useMissingInfoHandler = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  generateEvent: (prompt: string, modelProvider: 'openai' | 'anthropic', additionalInfo?: Record<string, string>) => Promise<any>
) => {
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});

  // Handle missing info change
  const handleAdditionalInfoChange = (
    field: string,
    value: string | Date | null
  ) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : String(value),
    }));
  };

  // Handle missing info submission
  const handleMissingInfoSubmit = async (missingInfo: any) => {
    if (!missingInfo) return;

    // Extract the missing fields from the missingInfo object
    const missingFields = missingInfo.missingFields || [];

    // Create a new prompt based on the missing fields
    let newPrompt = `I need more information to generate the event. Please provide the following: ${missingFields.join(
      ", "
    )}`;

    // Add the prompt as a user message to the chat
    setChatMessages((prev) => [...prev, { type: "user", content: newPrompt }]);

    // Show loading message
    setChatMessages((prev) => [
      ...prev,
      { type: "ai", content: "Generating your event details..." },
    ]);

    try {
      // Generate the event
      const response = await generateEvent(newPrompt, 'openai', additionalInfo);

      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      if (response.error) {
        // Display error message
        setChatMessages((prev) => [
          ...prev,
          { type: "ai", content: createErrorMessage() },
        ]);
        return;
      }

      // Type guard to ensure we're handling properties correctly
      if ('validatedEvent' in response && response.validatedEvent) {
        // Display success message
        setChatMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: createAIMessage(response.validatedEvent),
          },
        ]);
        return response;
      }
    } catch (error) {
      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      // Display error message
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
    }

    // Close the dialog
    setShowMissingInfoDialog(false);
    
    return null;
  };

  return {
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    additionalInfo,
    setAdditionalInfo,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit
  };
};
