
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "@/hooks/useEventCreation";
import { useGenerateEventAI } from "./useGenerateEventAI";
import { supabase } from "@/integrations/supabase/client";

export const useEventGeneration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createEvent, isCreating, createdEventId } = useEventCreation();
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
    generateEvent
  } = useGenerateEventAI();

  const [prompt, setPrompt] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    if (promptCount >= 1 && !isResubmitting) {
      setShowSignUpDialog(true);
      return;
    }

    const result = await generateEvent(prompt, selectedDate);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (result.needsMoreInfo) {
      setShowMissingInfoDialog(true);
      return;
    }

    if (result.validatedEvent) {
      setEventTitle(result.validatedEvent.title);
      toast({
        title: "Event Generated!",
        description: "Review the suggested event details below.",
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!generatedEvent) {
      toast({
        title: "Error",
        description: "No event details available. Please generate an event first.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have a title
    if (!eventTitle.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for your event.",
        variant: "destructive",
      });
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setShowSignUpDialog(true);
      return;
    }

    // Use the user-provided or AI-generated title
    const eventWithTitle = {
      ...generatedEvent,
      title: eventTitle.trim(),
      date: selectedDate || generatedEvent.date,
    };

    const { error } = await createEvent(eventWithTitle, additionalInfo);

    if (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Event created successfully.",
    });

    navigate("/events-hub");
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    promptCount,
    showSignUpDialog,
    setShowSignUpDialog,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
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
    handlePromptSubmit,
    handleCreateEvent,
  };
};
