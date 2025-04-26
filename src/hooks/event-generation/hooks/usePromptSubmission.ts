import { useState, useCallback } from "react";
import { ChatMessage } from "../types";
import { generateEventAPI } from "./services/eventGenerationService";
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
    
    try {
      // Add loading message to chat
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: "Generating your event plan...",
        id: `loading-${apiCallId}`
      }]);
      
      // Make API call to generate event
      const apiResponse = await generateEventAPI({
        prompt,
        additionalInfo,
        modelProvider
      });
      
      // Remove loading message
      setChatMessages(prev => prev.filter(msg => msg.id !== `loading-${apiCallId}`));
      
      // Only process the response if this is the latest API call
      if (apiCallId === latestApiCallId) {
        if (apiResponse.error) {
          throw apiResponse.error;
        }
        
        if (apiResponse.data) {
          // Process the response 
          const result = processResponse(
            {
              data: apiResponse.data,
              missing: Array.isArray(apiResponse.missing) ? apiResponse.missing : []
            },
            setChatMessages, 
            setGeneratedEvent,
            setPromptCount,
            isResubmitting,
            apiCallId
          );
          
          console.log(`usePromptSubmission [${apiCallId}]: Result from processResponse:`, result);
          
          if (result && result.validatedEvent) {
            // Encode event data and redirect
            const eventDataParam = encodeURIComponent(JSON.stringify(result.validatedEvent));
            console.log(`usePromptSubmission [${apiCallId}]: Redirecting to create-event with data:`, eventDataParam);
            window.location.href = `/create-event?data=${eventDataParam}`;
            return result;
          }
        }
      }
    } catch (error) {
      console.error(`usePromptSubmission [${apiCallId}]: Error generating event:`, error);
      
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
    latestApiCallId,
    isResubmitting
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
