
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, GeneratedEvent } from "../types";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";

export const usePromptHandler = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  coreGenerateEvent: (prompt: string, modelProvider: 'openai' | 'anthropic', additionalInfo?: Record<string, string>) => Promise<any>,
  setShowMissingInfoDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<GeneratedEvent | null>>
) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  // Handle prompt submission
  const handlePromptSubmit = async (userPrompt: string, modelProvider: 'openai' | 'anthropic' = 'openai') => {
    // Get the current prompt from the input field or use the passed one
    let currentPrompt = userPrompt.trim() || prompt.trim();
    
    console.log("Processing prompt:", currentPrompt);
    
    if (!currentPrompt) {
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return null;
    }

    // First add the user message to chat if it's not already there
    setChatMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.type !== 'user' || lastMessage?.content !== currentPrompt) {
        return [...prev, { type: 'user', content: currentPrompt }];
      }
      return prev;
    });

    // Show loading message
    setChatMessages(prev => [
      ...prev,
      { type: 'ai', content: "Generating your event details..." }
    ]);

    try {
      // Store the prompt before clearing the input
      const promptToSend = currentPrompt;
      
      // Clear the prompt input for better UX
      setPrompt("");
      
      // Generate the event using the stored prompt
      const response = await coreGenerateEvent(promptToSend, modelProvider);

      // Remove the loading message
      setChatMessages(prev => prev.slice(0, -1));

      if (response?.error) {
        // Display error message
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: createErrorMessage() }
        ]);
        return null;
      }

      // Type guard to ensure we're handling properties correctly for each response type
      if (response && 'needsBudget' in response) {
        return response;
      }

      if (response && 'missing' in response && response.missing && response.missing.length > 0) {
        // Create a message asking for missing information
        const missingFields = response.missing;
        let missingInfoMessage = "I need more information to generate this event. Could you please provide:";
        
        if (missingFields.includes('date')) {
          missingInfoMessage += "\n• The date and time of the event";
        }
        if (missingFields.includes('location')) {
          missingInfoMessage += "\n• The location for the event";
        }
        if (missingFields.includes('attendees')) {
          missingInfoMessage += "\n• The expected number of attendees";
        }
        if (missingFields.includes('budget')) {
          missingInfoMessage += "\n• Your budget for the event";
        }
        
        // Display missing info message
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: missingInfoMessage }
        ]);
        
        // Show the missing info dialog if we have date or location missing
        if (response.missing.includes('date') || response.missing.includes('location')) {
          setShowMissingInfoDialog(true);
        }
        return response;
      }

      if (response && 'validatedEvent' in response && response.validatedEvent) {
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
        
        return response;
      }
      
      // If we have data but not in the expected format, create a generic success message
      if (response && response.data) {
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: "I've created an event based on your request. Check out the details below!" }
        ]);
        return response;
      }
      
      return null;
    } catch (error) {
      // Remove the loading message
      setChatMessages(prev => prev.slice(0, -1));
      
      console.error("Error generating event:", error);
      setChatMessages(prev => [
        ...prev,
        { type: 'ai', content: createErrorMessage() }
      ]);
      
      return null;
    }
  };

  return {
    prompt,
    setPrompt,
    handlePromptSubmit
  };
};
