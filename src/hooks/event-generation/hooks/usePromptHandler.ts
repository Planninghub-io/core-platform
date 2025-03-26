
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
  const [isGenerating, setIsGenerating] = useState(false);
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

    setIsGenerating(true);

    try {
      // First add the user message to chat
      console.log("Adding user message:", currentPrompt);
      setChatMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        // Only add if it's not a duplicate
        if (lastMessage?.type !== 'user' || lastMessage?.content !== currentPrompt) {
          return [...prev, { type: 'user', content: currentPrompt }];
        }
        return prev;
      });

      // Store the prompt before clearing the input
      const promptToSend = currentPrompt;
      
      // Clear the prompt input
      setPrompt("");
      
      // Add a loading indicator message
      setChatMessages(prev => [...prev, { 
        type: "ai", 
        content: "Generating your event details..." 
      }]);
      
      // Generate the event
      console.log("Sending prompt to API:", promptToSend, "with model:", modelProvider);
      const response = await coreGenerateEvent(promptToSend, modelProvider);
      console.log("API response received:", response);

      // Remove the loading message
      setChatMessages(prev => 
        prev.filter(msg => msg.content !== "Generating your event details...")
      );

      if (!response || response?.error) {
        // Display error message
        console.error("Error in response:", response?.error);
        setChatMessages(prev => [
          ...prev.filter(msg => msg.content !== "Generating your event details..."),
          { type: 'ai', content: createErrorMessage() }
        ]);
        return null;
      }

      // Type guard to ensure we're handling properties correctly
      if (response && 'data' in response) {
        const data = response.data;
        console.log("Processing response data:", data);
        
        if (!data) {
          throw new Error("Invalid response data");
        }
        
        // Create an AI response message
        const aiMessage = `I've generated an event plan for "${data.title || 'your event'}". Here's what I've planned:
        
- Event: ${data.title || 'Unnamed Event'}
- Description: ${data.description || 'No description provided'}
- Location: ${data.location || 'Location to be determined'}
- Category: ${data.category || 'Other'}
${data.estimatedPrice ? `- Estimated budget: ${data.estimatedPrice}` : ''}

${data.missingFields?.length > 0 ? `I need more information about: ${data.missingFields.join(', ')}` : ''}`;

        // Add the AI response to chat
        console.log("Adding AI response to chat:", aiMessage);
        setChatMessages(prev => [
          ...prev.filter(msg => msg.content !== "Generating your event details..."),
          { type: 'ai', content: aiMessage }
        ]);

        // If we have a validated event, set it
        if (data.title || data.description) {
          console.log("Setting generated event:", data);
          setGeneratedEvent(data);
        }

        // Show the missing info dialog if we have date or location missing
        if (data.missingFields && (data.missingFields.includes('date') || data.missingFields.includes('location'))) {
          console.log("Missing fields detected, showing dialog");
          setShowMissingInfoDialog(true);
        }
        
        return response;
      }
      
      // If we don't have data in the expected format, add a generic message
      console.error("Response did not contain expected data format:", response);
      setChatMessages(prev => [
        ...prev.filter(msg => msg.content !== "Generating your event details..."),
        { type: 'ai', content: "I've processed your request, but couldn't generate a complete event. Please try providing more details." }
      ]);
      
      return null;
    } catch (error) {
      console.error("Error generating event:", error);
      
      // Remove the loading message
      setChatMessages(prev => 
        prev.filter(msg => msg.content !== "Generating your event details...")
      );
      
      // Add error message to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'ai', content: createErrorMessage() }
      ]);
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    handlePromptSubmit
  };
};
