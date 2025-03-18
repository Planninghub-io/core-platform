
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
    missingFields,
    waitingForBudget,
    setWaitingForBudget
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
    // First, check if we've collected all required missing info
    const missingInfoComplete = 
      (!missingFields.includes('date') || selectedDate || additionalInfo.date) &&
      (!missingFields.includes('location') || location || additionalInfo.location);
    
    // Only proceed if we have all the required info
    if (missingInfoComplete) {
      // Resubmit the original prompt with the additional info
      if (isResubmitting) {
        // Find the last user message in a way compatible with older JS versions
        let lastUserMessage = null;
        for (let i = chatMessages.length - 1; i >= 0; i--) {
          if (chatMessages[i].type === 'user') {
            lastUserMessage = chatMessages[i];
            break;
          }
        }

        if (lastUserMessage) {
          // Prepare the current additional info
          const currentAdditionalInfo = { ...additionalInfo };
          if (selectedDate && !currentAdditionalInfo.date) {
            currentAdditionalInfo.date = selectedDate;
          }
          if (location && !currentAdditionalInfo.location) {
            currentAdditionalInfo.location = location;
          }
          
          // Close the dialog immediately to prevent it from reopening
          setShowMissingInfoDialog(false);
          
          // Re-generate event with the same prompt but with additional info
          generateEvent(lastUserMessage.content, currentAdditionalInfo)
            .then(() => {
              // Clear the missing fields since we've addressed them
              setMissingInfo(null);
              setIsResubmitting(false);
            })
            .catch(error => {
              console.error("Error regenerating event:", error);
            });
        }
      } else {
        setShowMissingInfoDialog(false);
      }
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
    handleMissingInfoSubmit,
    waitingForBudget,
    setWaitingForBudget
  };
};
