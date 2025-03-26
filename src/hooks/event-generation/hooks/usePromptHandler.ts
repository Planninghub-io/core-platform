
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, GeneratedEvent } from "../types";
import { createErrorMessage, createAIMessage } from "../utils/chatMessageUtils";
import { getPromptFromChatMessages } from "./utils/promptProcessor";

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
    // Get the current prompt either from the input field or the last chat message
    let currentPrompt = prompt.trim();
    
    // If no current prompt in the input, try to get it from chat history
    if (!currentPrompt) {
      // We need to get the current chat messages from the setter function
      // Since we can't directly access the state from the setter, we'll have to 
      // implement a different approach
      setChatMessages(prevMessages => {
        currentPrompt = getPromptFromChatMessages(prevMessages);
        return prevMessages; // Return the same array to avoid re-render
      });
    }
      
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
      // Generate the event
      const response = await coreGenerateEvent(currentPrompt, modelProvider);

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
