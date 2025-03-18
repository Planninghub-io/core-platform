
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";

export const usePromptSubmission = (
  prompt: string,
  setPrompt: (prompt: string) => void, 
  promptCount: number,
  setShowSignUpDialog: (show: boolean) => void,
  selectedDate: string,
  setSelectedDate: (date: string) => void,
  location: string, 
  setLocation: (location: string) => void,
  chatMessages: ChatMessage[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  generateEvent: (prompt: string, additionalInfo: Record<string, string>) => Promise<any>,
  isResubmitting: boolean,
  setShowMissingInfoDialog: (show: boolean) => void
) => {
  const { toast } = useToast();

  const extractDateFromPrompt = (promptText: string) => {
    // Try to find date patterns in the format "April 1st" or "April 1st, 2023" or with "at 2:00 PM"
    const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+(?:\d{4})?\s*(?:at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
    const simpleDateRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
    
    const dateTimeMatch = promptText.match(dateTimeRegex);
    const simpleDateMatch = !dateTimeMatch ? promptText.match(simpleDateRegex) : null;
    
    if ((dateTimeMatch || simpleDateMatch) && !selectedDate) {
      try {
        const dateStr = dateTimeMatch ? dateTimeMatch[1] : (simpleDateMatch ? simpleDateMatch[1] : "");
        // If year is missing, add the current year
        const currentYear = new Date().getFullYear();
        const dateWithYear = dateStr.includes(String(currentYear)) ? dateStr : `${dateStr}, ${currentYear}`;
        
        const date = new Date(dateWithYear);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      } catch (e) {
        console.error("Error parsing date:", e);
        // Ignore date parsing errors
      }
    }
    return null;
  };

  const extractLocationFromPrompt = (promptText: string) => {
    // Match "in City", "at Place", "in City, State"
    const locationRegex = /(?:in|at)\s+([^,.]+(?:,\s*[^,.]+)?)/i;
    const locationMatch = promptText.match(locationRegex);
    
    // Look for cities/locations directly in the prompt
    if (locationMatch && !location) {
      return locationMatch[1].trim();
    }
    
    return null;
  };

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
    const extractedDate = extractDateFromPrompt(prompt);
    if (extractedDate) {
      setSelectedDate(extractedDate);
    }

    // Extract location from prompt if present
    const extractedLocation = extractLocationFromPrompt(prompt);
    if (extractedLocation) {
      setLocation(extractedLocation);
    }

    // Prepare additional info
    const additionalInfo: Record<string, string> = {};
    if (selectedDate) {
      additionalInfo.date = selectedDate;
    } else if (extractedDate) {
      additionalInfo.date = extractedDate;
    }
    
    if (location) {
      additionalInfo.location = location;
    } else if (extractedLocation) {
      additionalInfo.location = extractedLocation;
    }

    // Save the user's input before clearing it
    const userPrompt = prompt;
    
    // Clear the input field immediately after submission
    setPrompt("");

    const result = await generateEvent(userPrompt, additionalInfo);

    if (result && result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Show the missing info dialog if needed
    if ((result && result.needsMoreInfo) || (result && result.missing && result.missing.length > 0)) {
      setShowMissingInfoDialog(true);
      return;
    }

    // If there's a validated event with no missing fields, set the title and proceed
    if (result && result.validatedEvent && (!result.missing || result.missing.length === 0)) {
      if (result.validatedEvent.location && !location) {
        setLocation(result.validatedEvent.location);
      }
      
      toast({
        title: "Event Generated!",
        description: "Review the suggested event details below.",
      });
    }
  };

  return { handlePromptSubmit };
};
