
import { generateEventWithAPI } from "./eventGenerationAPI";
import { extractInfoFromPrompt } from "../utils/promptExtractor";
import { ChatMessage } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { processResponse } from "../utils/responseProcessor";

/**
 * Submit prompt to the API and process the response
 */
export const submitPrompt = async (
  prompt: string,
  modelProvider: 'openai' | 'anthropic',
  additionalInfo: Record<string, string>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void,
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
) => {
  // Validate the prompt
  if (!prompt || prompt.trim() === "") {
    console.log("Empty prompt, not submitting");
    return { error: new Error("Please enter an event description") };
  }
  
  // Extract additional information from the prompt
  const extractedInfo = extractInfoFromPrompt(prompt);
  const combinedInfo = { ...additionalInfo, ...extractedInfo };
  
  setIsGenerating(true);
  
  try {
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);
    
    // Add loading message
    setChatMessages(prev => [...prev, { type: 'ai', content: "Generating your event details..." }]);
    
    console.log("Combined info for API call:", combinedInfo);
    console.log("Using model provider:", modelProvider);
    
    // Generate the event
    const response = await generateEventWithAPI(
      prompt,
      modelProvider,
      combinedInfo
    );
    
    // Remove loading message
    setChatMessages(prev => {
      const newMessages = [...prev];
      return newMessages.filter((msg, index) => 
        !(index === newMessages.length - 1 && msg.type === 'ai' && msg.content === "Generating your event details...")
      );
    });
    
    if (response.error) {
      throw response.error;
    }
    
    // Process the response and handle missing fields
    const processed = processResponse(
      response, 
      setChatMessages, 
      waitingForBudget, 
      requestBudgetInChat, 
      setPreviouslyRequestedFields
    );
    
    // If we processed the response successfully
    if (processed) {
      // Update prompt count for non-resubmissions with complete data
      if (!isResubmitting && processed.missing && processed.missing.length === 0) {
        setPromptCount(prev => prev + 1);
      }
      
      return processed;
    }
    
    // If we couldn't process the response, show a generic success message
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: "I've generated an event based on your request. Please review the details."
    }]);
    
    // Return the raw response
    return response;
    
  } catch (error: any) {
    console.error("Error submitting prompt:", error);
    
    // Remove loading message if it exists
    setChatMessages(prev => {
      return prev.filter(msg => 
        !(msg.type === 'ai' && msg.content === "Generating your event details...")
      );
    });
    
    // Add error message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: "I'm sorry, I encountered an error while generating your event. Please try again with more details."
    }]);
    
    return { error };
  } finally {
    setIsGenerating(false);
  }
};
