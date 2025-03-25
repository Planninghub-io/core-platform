
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
        return null;
      }

      // Type guard to ensure we're handling properties correctly for each response type
      if ('needsBudget' in response) {
        return response;
      }

      if ('missing' in response && response.missing && response.missing.length > 0) {
        // Display missing info message
        setChatMessages(prev => [
          ...prev,
          { type: 'ai', content: "I need more information to generate this event. Can you please provide the missing details?" }
        ]);
        
        // Show the missing info dialog if we have date or location missing
        if (response.missing.includes('date') || response.missing.includes('location')) {
          setShowMissingInfoDialog(true);
        }
        return response;
      }

      if ('validatedEvent' in response && response.validatedEvent) {
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
    } finally {
      // Clear the prompt
      setPrompt("");
    }
  };

  return {
    prompt,
    setPrompt,
    handlePromptSubmit
  };
};
