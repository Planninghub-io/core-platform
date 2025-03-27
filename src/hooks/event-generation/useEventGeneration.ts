
import { useState } from "react";
import { useEventCreation } from "@/hooks/useEventCreation";
import { useGenerateEventAI } from "./useGenerateEventAI";
import { usePromptSubmission } from "./hooks/usePromptSubmission";
import { EventGenerationHookReturn } from "./types/hook-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useEventGeneration = (): any => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    createEvent: originalCreateEvent, 
    isCreating, 
    createdEventId, 
    showSignUpDialog, 
    setShowSignUpDialog 
  } = useEventCreation();
  
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'ai', content: string }>>([]);
  const [prompt, setPrompt] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [waitingForBudget, setWaitingForBudget] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  
  // Request budget in chat
  const requestBudgetInChat = () => {
    setWaitingForBudget(true);
    setChatMessages((prev) => [
      ...prev,
      {
        type: "ai",
        content: "To provide a more accurate event plan, could you please specify your budget?",
      },
    ]);
  };
  
  // Use the prompt submission hook
  const { 
    isGenerating, 
    promptCount, 
    missingInfo, 
    generatedEvent,
    setGeneratedEvent,
    isResubmitting,
    setIsResubmitting,
    missingFields,
    handlePromptSubmit: originalHandlePromptSubmit
  } = usePromptSubmission(
    setChatMessages,
    waitingForBudget,
    requestBudgetInChat
  );

  // Check if date or location is missing
  const hasMissingDate = missingFields?.includes('date') || (!selectedDate && !generatedEvent?.date);
  const hasMissingLocation = missingFields?.includes('location') || (!location && !generatedEvent?.location);

  // Handle additional info changes
  const handleAdditionalInfoChange = (field: string, value: string) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update the local state as well for display purposes
    if (field === 'date') {
      setSelectedDate(value);
    } else if (field === 'location') {
      setLocation(value);
    }
  };

  // Handle missing info submission
  const handleMissingInfoSubmit = () => {
    setShowMissingInfoDialog(false);
    console.log("Additional info submitted:", additionalInfo);
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
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
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
      budget: parseFloat(generatedEvent.estimatedPrice) || null,
      event_type: generatedEvent.category,
      image_url: generatedEvent.imageUrl,
      user_id: user.id
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

      // Redirect to events hub page
      navigate('/events-hub');
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
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
    isCreating,
    createdEventId,
    eventTitle,
    setEventTitle,
    handlePromptSubmit: originalHandlePromptSubmit,
    handleCreateEvent,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    hasMissingDate,
    hasMissingLocation,
    chatMessages,
    setChatMessages,
    additionalInfo,
    setAdditionalInfo,
    showMissingInfoDialog,
    setShowMissingInfoDialog,
    handleAdditionalInfoChange,
    handleMissingInfoSubmit,
    waitingForBudget,
    setWaitingForBudget,
    requestBudgetInChat
  };
};
