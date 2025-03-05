
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "@/hooks/useEventCreation";
import { useGenerateEventAI } from "./useGenerateEventAI";
import { supabase } from "@/integrations/supabase/client";

export const useEventGeneration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createEvent, isCreating, createdEventId, showSignUpDialog, setShowSignUpDialog } = useEventCreation();
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
  // Check if date or location is missing
  const hasMissingDate = missingFields?.includes('date') || !selectedDate && !generatedEvent?.date;
  const hasMissingLocation = missingFields?.includes('location') || !location && !generatedEvent?.location;

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
      // Check if user is already signed in
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setShowSignUpDialog(true);
        return;
      }
    }

    // First add the user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);

    // Extract date from prompt if present
    const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
    const dateTimeMatch = prompt.match(dateTimeRegex);
    
    if (dateTimeMatch && !selectedDate) {
      try {
        const dateStr = dateTimeMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date.toISOString());
        }
      } catch (e) {
        // Ignore date parsing errors
      }
    }

    // Extract location from prompt if present
    const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
    const locationMatch = prompt.match(locationRegex);
    
    if (locationMatch && !location) {
      setLocation(locationMatch[1].trim());
    }

    // Save the user's input before clearing it
    const userPrompt = prompt;
    
    // Clear the input field immediately after submission
    setPrompt("");

    const result = await generateEvent(userPrompt, selectedDate);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // If there's a validated event, set the title and proceed
    if (result.validatedEvent) {
      setEventTitle(result.validatedEvent.title);
      
      // If location was found in generated event, update it
      if (result.validatedEvent.location && !location) {
        setLocation(result.validatedEvent.location);
      }
      
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
    if (!eventTitle.trim() || eventTitle === 'Enter Event Name') {
      toast({
        title: "Error",
        description: "Please provide a title for your event.",
        variant: "destructive",
      });
      return;
    }

    // Check if date is required but missing
    if (hasMissingDate && !selectedDate) {
      toast({
        title: "Error",
        description: "Please provide a date for your event.",
        variant: "destructive",
      });
      return;
    }

    // Check if location is required but missing
    if (hasMissingLocation && !location) {
      toast({
        title: "Error",
        description: "Please provide a location for your event.",
        variant: "destructive",
      });
      return;
    }

    // Use the user-provided or AI-generated title, date, and location
    const eventWithUpdates = {
      ...generatedEvent,
      title: eventTitle.trim(),
      date: selectedDate || generatedEvent.date,
      location: location || generatedEvent.location,
    };

    const { error, requiresAuth } = await createEvent(eventWithUpdates, additionalInfo);

    // If auth is required, the dialog will be shown by useEventCreation
    if (requiresAuth) {
      return;
    }

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
    missingFields
  };
};
