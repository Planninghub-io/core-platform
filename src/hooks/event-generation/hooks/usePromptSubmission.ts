
import { useState, useCallback, useEffect } from "react";
import { ChatMessage } from "../types";
import { generateEventAPI } from "./services/eventGenerationService";
import { processResponse } from "./utils/responseProcessor";
import { submitPrompt } from "./services/promptSubmissionService";

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
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectData, setRedirectData] = useState<any>(null);

  // Effect to handle redirections when event is generated
  useEffect(() => {
    if (generatedEvent && (!missingFields.length || missingFields.length === 0)) {
      try {
        console.log("usePromptSubmission: Valid event generated, preparing for redirect:", generatedEvent);
        // Add a small delay to ensure the success message is shown before redirecting
        const redirectTimeout = setTimeout(() => {
          try {
            const eventDataParam = encodeURIComponent(JSON.stringify(generatedEvent));
            console.log("usePromptSubmission: Redirecting to create-event with data:", eventDataParam);
            window.location.href = `/create-event?data=${eventDataParam}`;
          } catch (error) {
            console.error("Error during redirect:", error);
            setChatMessages(prev => [...prev, {
              type: 'ai',
              content: "I created your event but encountered an error preparing the form. Please try again."
            }]);
          }
        }, 1500); // 1.5 second delay
        
        return () => clearTimeout(redirectTimeout);
      } catch (error) {
        console.error("Error preparing redirect:", error);
      }
    }
  }, [generatedEvent, missingFields]);

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
    
    // Generate a unique ID for this API call
    const apiCallId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setLatestApiCallId(apiCallId);
    
    // Use the submitPrompt service to handle the prompt submission
    const result = await submitPrompt(
      prompt,
      modelProvider,
      additionalInfo,
      setChatMessages,
      setIsGenerating,
      waitingForBudget,
      requestBudgetInChat,
      setPreviouslyRequestedFields,
      setPromptCount,
      isResubmitting,
      setGeneratedEvent,
      apiCallId
    );
    
    if (result && result.validatedEvent) {
      // Store the missing fields
      setMissingFields(result.missing || []);
      
      // If there are no missing fields, we can set the redirect data
      if (!result.missing || result.missing.length === 0) {
        console.log("usePromptSubmission: Complete event data received, setting for redirect");
      }
    }
    
    setIsGenerating(false);
    return result;
    
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
