
import { useState, useCallback } from "react";
import { ChatMessage } from "../types";
import { generateEventWithAPI } from "./services/eventGenerationService";
import { processResponse } from "./utils/responseProcessor";

/**
 * Hook for handling prompt submissions and processing responses
 */
export const usePromptSubmission = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingInfo, setMissingInfo] = useState(null);
  const [generatedEvent, setGeneratedEvent] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);
  const [latestApiCallId, setLatestApiCallId] = useState<string | null>(null);

  /**
   * Handle prompt submission to AI
   */
  const handlePromptSubmit = useCallback(async (
    prompt: string, 
    modelProvider: 'openai' | 'anthropic' = 'openai',
    additionalInfo = {}
  ) => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { 
      type: 'user', 
      content: prompt 
    }]);
    
    // Generate a unique ID for this API call
    const apiCallId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setLatestApiCallId(apiCallId);
    
    console.log(`usePromptSubmission [${apiCallId}]: Submitting prompt:`, prompt);
    
    try {
      // Make API call to generate event
      const response = await generateEventWithAPI(
        prompt,
        previouslyRequestedFields,
        modelProvider,
        additionalInfo,
        apiCallId
      );
      
      console.log(`usePromptSubmission [${apiCallId}]: Received API response:`, response);
      
      // Only process the latest API call's response
      if (apiCallId === latestApiCallId) {
        // Process the response
        const result = processResponse(
          response, 
          setChatMessages, 
          waitingForBudget, 
          requestBudgetInChat,
          setPreviouslyRequestedFields,
          apiCallId
        );
        
        console.log(`usePromptSubmission [${apiCallId}]: Result from submitPrompt:`, result);
        
        if (result && result.validatedEvent) {
          // Set missing fields
          if (result.missing && result.missing.length) {
            setMissingFields(result.missing);
          } else {
            setMissingFields([]);
          }
          
          // Important: Set the generated event regardless of missing fields
          console.log(`usePromptSubmission [${apiCallId}]: Setting generated event:`, result.validatedEvent);
          setGeneratedEvent(result.validatedEvent);
          
          // Increment prompt count
          setPromptCount(prev => prev + 1);
          
          return result;
        }
      } else {
        console.log(`usePromptSubmission [${apiCallId}]: Ignoring result as a newer API call was made`);
      }
    } catch (error) {
      console.error(`usePromptSubmission [${apiCallId}]: Error generating event:`, error);
      
      // Add error message to chat
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: "I'm sorry, I couldn't generate an event based on your request. Please try again with more details." 
      }]);
    } finally {
      setIsGenerating(false);
    }
    
    return null;
  }, [
    isGenerating, 
    setChatMessages, 
    previouslyRequestedFields, 
    waitingForBudget, 
    requestBudgetInChat, 
    latestApiCallId
  ]);

  return {
    isGenerating,
    promptCount,
    missingInfo,
    generatedEvent,
    setGeneratedEvent,
    isResubmitting,
    setIsResubmitting,
    missingFields,
    handlePromptSubmit
  };
};
