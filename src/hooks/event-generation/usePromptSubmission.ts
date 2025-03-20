import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";
import { 
  extractDateFromPrompt,
  extractLocationFromPrompt,
  extractBudgetFromPrompt
} from "./utils/prompt-extraction";

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

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    // Check authentication for non-first prompts
    if (promptCount >= 1 && !isResubmitting) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setShowSignUpDialog(true);
        return;
      }
    }

    // First add the user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);

    // Extract information from the prompt
    const extractedDate = extractDateFromPrompt(prompt);
    if (extractedDate) {
      setSelectedDate(extractedDate);
    }

    const extractedLocation = extractLocationFromPrompt(prompt);
    if (extractedLocation) {
      setLocation(extractedLocation);
    }

    const extractedBudget = extractBudgetFromPrompt(prompt);

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
    
    if (extractedBudget) {
      additionalInfo.budget = extractedBudget;
    }

    // Save the user's input before clearing it
    const userPrompt = prompt;
    
    // Clear the input field immediately after submission
    setPrompt("");

    // Generate the event
    const result = await generateEvent(userPrompt, additionalInfo);

    if (result && result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // No need to show the dialog for asking budget, now handled in chat
    if (result && result.needsBudget) {
      return;
    }

    // Show the missing info dialog ONLY if we have date or location missing
    // Budget is handled through chat
    if (result && result.needsMoreInfo) {
      const missingInfo = result.data || { missingFields: [] };
      // Filter out 'budget' from missing fields for dialog
      const dialogMissingFields = missingInfo.missingFields.filter(
        (field: string) => field !== 'budget'
      );
      
      if (dialogMissingFields.length > 0) {
        // Update missingInfo fields to exclude budget
        missingInfo.missingFields = dialogMissingFields;
        console.log("Showing dialog for missing fields:", dialogMissingFields);
        setShowMissingInfoDialog(true);
      } else {
        console.log("No fields for dialog, only had budget which is handled in chat");
      }
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
