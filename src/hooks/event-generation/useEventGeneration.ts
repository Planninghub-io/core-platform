
import { useState } from "react";
import { useEventCreation } from "@/hooks/useEventCreation";
import { useGenerateEventAI } from "./useGenerateEventAI";
import { usePromptSubmission } from "./usePromptSubmission";
import { useEventCreationHandler } from "./useEventCreation";
import { EventGenerationHookReturn } from "./types/hook-types";

export const useEventGeneration = (): EventGenerationHookReturn => {
  const { 
    createEvent: originalCreateEvent, 
    isCreating, 
    createdEventId, 
    showSignUpDialog, 
    setShowSignUpDialog 
  } = useEventCreation();
  
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
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  
  // Check if date or location is missing
  const hasMissingDate = missingFields?.includes('date') || !selectedDate && !generatedEvent?.date;
  const hasMissingLocation = missingFields?.includes('location') || !location && !generatedEvent?.location;

  // Wrap the original createEvent to match the expected signature
  const createEvent = async (eventData: any) => {
    const result = await originalCreateEvent(eventData, additionalInfo);
    return { 
      eventId: result.data ? result.data.id : null 
    };
  };

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
    isResubmitting,
    setShowMissingInfoDialog
  );

  // Handle changes to the additional info
  const handleAdditionalInfoChange = (field: string, value: string) => {
    const updatedInfo = { ...additionalInfo, [field]: value };
    setAdditionalInfo(updatedInfo);

    // Update the local state as well for display purposes
    if (field === 'date') {
      setSelectedDate(value);
    } else if (field === 'location') {
      setLocation(value);
    }
  };

  // Handle submission of missing info
  const handleMissingInfoSubmit = () => {
    // Resubmit the original prompt with the additional info
    if (isResubmitting) {
      const lastUserMessage = chatMessages.findLast(msg => msg.type === 'user');
      if (lastUserMessage) {
        // Re-generate event with the same prompt but with additional info
        generateEvent(lastUserMessage.content, additionalInfo)
          .then(() => {
            // Close the dialog once processing is complete
            setShowMissingInfoDialog(false);
          });
      }
    } else {
      setShowMissingInfoDialog(false);
    }
  };

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
    missingFields,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit
  };
};
