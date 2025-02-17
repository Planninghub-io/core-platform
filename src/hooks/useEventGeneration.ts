
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface GeneratedEvent {
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
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showMissingInfoDialog, setShowMissingInfoDialog] = useState(false);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

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

      const { data, error } = await supabase.functions.invoke('generate-event', {
        body: { prompt: fullPrompt },
      });

      if (error) throw error;

      if (data.needsInfo && !isResubmitting) {
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
          prePopulatedInfo.location = locationMatch[1];
        }

        setAdditionalInfo(prePopulatedInfo);
        setMissingInfo(data);
        setShowMissingInfoDialog(true);
        setIsResubmitting(true);
        return;
      }

      setGeneratedEvent(data);
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

    } catch (error) {
      console.error('Error generating event:', error);
      toast({
        title: "Error",
        description: "Failed to generate event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!generatedEvent) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setShowSignUpDialog(true);
      return;
    }

    setIsCreating(true);
    try {
      // First, try to generate the image
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-event-image', {
        body: { prompt: generatedEvent.imagePrompt },
      });

      if (imageError) {
        console.error('Error generating image:', imageError);
      }

      // Parse price string to get numeric value with safe fallback
      let price = 0;
      try {
        if (generatedEvent.estimatedPrice) {
          const priceString = generatedEvent.estimatedPrice.replace(/[^0-9.]/g, '');
          price = parseFloat(priceString) || 0;
        }
      } catch (error) {
        console.error('Error parsing price:', error);
      }

      // Format the date properly
      let formattedStartDate: string;
      let formattedEndDate: string;

      if (generatedEvent.date === 'flexible') {
        // If date is flexible, use a future date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 7); // Start a week from now
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // Default 2-hour duration
        formattedStartDate = startDate.toISOString();
        formattedEndDate = endDate.toISOString();
      } else {
        // Parse the specific date
        const startDate = new Date(generatedEvent.date);
        if (isNaN(startDate.getTime())) {
          // If the date is invalid, use the date from additionalInfo
          const providedDate = additionalInfo.datetime 
            ? new Date(additionalInfo.datetime)
            : new Date();
          formattedStartDate = providedDate.toISOString();
          const endDate = new Date(providedDate);
          endDate.setHours(endDate.getHours() + 2);
          formattedEndDate = endDate.toISOString();
        } else {
          formattedStartDate = startDate.toISOString();
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 2);
          formattedEndDate = endDate.toISOString();
        }
      }

      const { data, error } = await supabase.from('events').insert({
        title: generatedEvent.title,
        description: generatedEvent.description,
        date: formattedStartDate,
        end_date: formattedEndDate,
        location: generatedEvent.location,
        category: generatedEvent.category,
        price: price,
        user_id: userData.user.id,
        status: 'upcoming',
        image_url: imageData?.image_url || null
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event created successfully.",
      });
      
      setCreatedEventId(data.id);
      
      // Navigate to events hub after successful creation
      navigate("/events-hub");

    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
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
    handlePromptSubmit,
    handleCreateEvent,
  };
};
