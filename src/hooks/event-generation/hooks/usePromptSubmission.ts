
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
    
    console.log(`usePromptSubmission [${apiCallId}]: Submitting prompt:`, prompt);
    
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
      
      console.log(`usePromptSubmission [${apiCallId}]: Received API response:`, apiResponse);
      
      // Remove loading message
      setChatMessages(prev => prev.filter(msg => msg.id !== `loading-${apiCallId}`));
      
      // Only process the response if this is the latest API call
      if (apiCallId === latestApiCallId) {
        // Check if there's an error in the response
        if (apiResponse.error) {
          throw apiResponse.error;
        }
        
        // If we have data, process the response
        if (apiResponse.data) {
          // Process the response 
          const responseData = {
            data: apiResponse.data,
            missing: Array.isArray(apiResponse.missing) ? apiResponse.missing : []
          };
          
          console.log(`usePromptSubmission [${apiCallId}]: Processing response with data:`, responseData);
          
          // Set the generated event right away
          setGeneratedEvent(apiResponse.data);
          
          // Process the response - this should redirect to the event creation form
          const result = processResponse(
            responseData,
            setChatMessages, 
            setGeneratedEvent,
            setPromptCount,
            isResubmitting,
            apiCallId
          );
          
          console.log(`usePromptSubmission [${apiCallId}]: Result from processResponse:`, result);
          
          // Navigate directly to create-event page with data
          if (result && result.validatedEvent) {
            const eventDataParam = encodeURIComponent(JSON.stringify(result.validatedEvent));
            window.location.href = `/create-event?data=${eventDataParam}`;
            return result;
          }
        } else {
          console.error(`usePromptSubmission [${apiCallId}]: No data in API response:`, apiResponse);
          throw new Error("No data in API response");
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
