
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEventCreation, type EventToCreate } from "./useEventCreation";

interface GeneratedEvent extends EventToCreate {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

interface MissingInfo {
  needsInfo: true;
  missingFields: string[];
  message: string;
}

export const useEventGeneration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createEvent, isCreating, createdEventId } = useEventCreation();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
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

    setIsGenerating(true);
    try {
      let fullPrompt = prompt;
      if (Object.keys(additionalInfo).length > 0) {
        const additionalDetails = Object.entries(additionalInfo)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
      }

      console.log('Sending prompt to generate event:', fullPrompt);

      const { data, error } = await supabase.functions.invoke('generate-event', {
        body: { prompt: fullPrompt },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Received response from generate-event:', data);

      // Handle missing info response
      if (data && data.needsInfo === true) {
        if (!isResubmitting) {
          const prePopulatedInfo: Record<string, string> = {};
          
          const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
          const dateTimeMatch = prompt.match(dateTimeRegex);
          
          const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
          const locationMatch = prompt.match(locationRegex);

          if (dateTimeMatch && data.missingFields.includes('date')) {
            prePopulatedInfo.date = dateTimeMatch[1];
          }
          
          if (locationMatch && (data.missingFields.includes('location') || data.missingFields.includes('city'))) {
            const locationField = data.missingFields.includes('location') ? 'location' : 'city';
            prePopulatedInfo[locationField] = locationMatch[1];
          }

          setAdditionalInfo(prePopulatedInfo);
          setMissingInfo(data);
          setShowMissingInfoDialog(true);
          setIsResubmitting(true);
          setIsGenerating(false);
          return;
        }
      }

      if (!data || typeof data !== 'object') {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from event generation');
      }

      // Create event object, allowing for missing title
      const validatedEvent: GeneratedEvent = {
        title: data.title?.trim() || '',
        description: data.description || '',
        date: selectedDate || data.date || '',
        location: data.location || '',
        category: data.category || '',
        estimatedPrice: data.estimatedPrice || '',
        imagePrompt: data.imagePrompt || 'event',
      };

      console.log('Created validated event:', validatedEvent);
      setEventTitle(validatedEvent.title); // Set initial title if provided
      setGeneratedEvent(validatedEvent);
      setMissingInfo(null);
      setShowMissingInfoDialog(false);
      setAdditionalInfo({});
      setIsResubmitting(false);
      
      if (!isResubmitting) {
        setPromptCount(prev => prev + 1);
      }
      
      toast({
        title: "Event Generated!",
        description: "Review the suggested event details below.",
      });

    } catch (error: any) {
      console.error('Error generating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
