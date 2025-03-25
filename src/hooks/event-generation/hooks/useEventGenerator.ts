
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MissingInfo, ChatMessage } from "../types";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";
import { extractMissingFields } from "../utils/prompt-extraction/promptFieldExtractor";
import { useEventGeneratorCore } from "./useEventGeneratorCore";
import { usePromptSubmission } from "./usePromptSubmission";

export const useEventGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([]);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [waitingForBudget, setWaitingForBudget] = useState(false);
  const { toast } = useToast();

  // Request budget in chat function
  const requestBudgetInChat = useCallback(() => {
    setWaitingForBudget(true);
    setChatMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content:
          "To provide a more accurate event plan, could you please specify your budget?",
      },
    ]);
  }, [setChatMessages, setWaitingForBudget]);

  // Event Generator Core Hook
  const {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    additionalInfo: coreAdditionalInfo,
    setAdditionalInfo: setCoreAdditionalInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    generateEvent: coreGenerateEvent,
    missingFields,
    previouslyRequestedFields
  } = useEventGeneratorCore(setChatMessages, waitingForBudget, requestBudgetInChat);

  // Handle prompt submission
  const handlePromptSubmit = async (modelProvider: 'openai' | 'anthropic' = 'openai') => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    // First add the user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);

    // Show loading message
    setChatMessages(prev => [
      ...prev,
      { type: 'ai', content: "Generating your event details..." }
    ]);

    try {
      // Generate the event
      const response = await coreGenerateEvent(prompt, modelProvider);

      // Remove the loading message
      setChatMessages(prev => prev.slice(0, -1));

      if (response.error) {
        // Display error message
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: createErrorMessage() }
        ]);
        return;
      }

      if (response.needsBudget) {
        return;
      }

      if (response.missing && response.missing.length > 0) {
        // Display missing info message
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: "I need more information to generate this event. Can you please provide the missing details?" }
        ]);
        
        // Show the missing info dialog if we have date or location missing
        if (response.missing.includes('date') || response.missing.includes('location')) {
          setShowMissingInfoDialog(true);
        }
        return;
      }

      if (response.validatedEvent) {
        // Display success message
        setGeneratedEvent(response.validatedEvent);
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: createAIMessage(response.validatedEvent) }
        ]);
        
        toast({
          title: "Event Generated!",
          description: "Review the suggested event details below.",
        });
      }
    } catch (error) {
      // Remove the loading message
      setChatMessages(prev => prev.slice(0, -1));
      
      console.error("Error generating event:", error);
      setChatMessages(prev => [
        ...prev,
        { type: 'ai', content: createErrorMessage() }
      ]);
    }

    // Clear the prompt
    setPrompt("");
  };

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
  const handleMissingInfoSubmit = async () => {
    if (!missingInfo) return;

    // Extract the missing fields from the missingInfo object
    const missingFields = extractMissingFields(missingInfo);

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
      const response = await coreGenerateEvent(newPrompt, 'openai', additionalInfo);

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

      if (response.validatedEvent) {
        // Display success message
        setGeneratedEvent(response.validatedEvent);
        setChatMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: createAIMessage(response.validatedEvent),
          },
        ]);
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
  };

  // Handle create event
  const handleCreateEvent = async () => {
    if (!generatedEvent) {
      toast({
        title: "Error",
        description: "Please generate an event first.",
        variant: "destructive",
      });
      return;
    }

    if (!eventTitle) {
      toast({
        title: "Error",
        description: "Please enter an event title.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      // Store event data for later creation
      return setShowSignUpDialog(true);
    }

    // Create event object
    const eventData = {
      title: eventTitle,
      description: generatedEvent.description,
      date: selectedDate || generatedEvent.date,
      end_date: selectedDate || generatedEvent.date, // Required field for DB
      location: location || generatedEvent.location,
      budget: generatedEvent.estimatedPrice,
      event_type: generatedEvent.category,
      image_url: generatedEvent.imageUrl,
      user_id: userData.user.id
    };

    // Create event in database
    try {
      // Insert the new event into the database
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Show success message
      toast({
        description: "Event created successfully!",
      });

      // Redirect to event page
      window.location.href = `/event/${data.id}`;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Regenerate event with updated info
  const regenerateEventWithUpdatedInfo = async (
    updatedPrompt: string,
    updatedModelProvider: 'openai' | 'anthropic' = 'openai'
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
        return;
      }

      if (response.validatedEvent) {
        // Display success message
        setGeneratedEvent(response.validatedEvent);
        setChatMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: createAIMessage(response.validatedEvent),
          },
        ]);
      }
    } catch (error) {
      // Remove the loading message
      setChatMessages((prev) => prev.slice(0, -1));

      // Display error message
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: createErrorMessage() },
      ]);
    } finally {
      setIsResubmitting(false);
    }
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
    handlePromptSubmit,
    handleCreateEvent,
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
    handleMissingInfoSubmit,
    waitingForBudget,
    setWaitingForBudget,
    isResubmitting,
    setIsResubmitting,
    generateEvent: coreGenerateEvent,
    missingFields,
    regenerateEventWithUpdatedInfo
  };
};
