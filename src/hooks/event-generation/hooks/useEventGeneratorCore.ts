
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateEventAPI } from "../api/generateEventAPI";
import { createErrorMessage } from "../utils/chatMessageUtils";
import { ChatMessage } from "../types";
import { useResponseChecker } from "./useResponseChecker";
import { useEventProcessor } from "./useEventProcessor";

/**
 * Core hook for event generation functionality
 */
export const useEventGeneratorCore = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [missingInfo, setMissingInfo] = useState<any>(null);

  // Use our new focused hooks
  const {
    previouslyRequestedFields,
    setPreviouslyRequestedFields,
    checkUserResponse
  } = useResponseChecker();

  const {
    additionalInfo,
    setAdditionalInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    missingFields,
    processEventResponse
  } = useEventProcessor(setChatMessages, waitingForBudget, requestBudgetInChat, setPreviouslyRequestedFields);

  /**
   * Generate an event based on a prompt and additional information
   */
  const generateEvent = async (prompt: string, modelProvider: 'openai' | 'anthropic' = 'openai', providedInfo: Record<string, string> = {}) => {
    setIsGenerating(true);
    
    try {
      // Check if the user's response contains information we previously asked for
      const { containsAllInfo, updatedProvidedInfo } = checkUserResponse(
        prompt,
        previouslyRequestedFields
      );
      
      // If we found all the information we asked for, clear the requested fields
      if (containsAllInfo) {
        // Add the extracted info to providedInfo
        Object.assign(providedInfo, updatedProvidedInfo);
        
        // Clear previously requested fields since we got responses for them
        setPreviouslyRequestedFields([]);
      }
      
      // Combine the existing additional info with provided info
      const combinedInfo = { ...additionalInfo, ...providedInfo };
      
      // Log the combined info for debugging
      console.log("Combined info before API call:", combinedInfo);
      console.log("Using model provider:", modelProvider);
      console.log("Sending prompt to generate event:", prompt);
      
      // Call the API
      const response = await generateEventAPI({
        prompt,
        additionalInfo: combinedInfo,
        modelProvider
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      console.log("Received response from generate-event:", data);

      // Process the event response
      const result = processEventResponse(data, prompt, providedInfo);
      
      // If we need to check for budget
      if (result?.needsBudget) {
        setIsGenerating(false);
        return { needsBudget: true, validatedEvent: result.validatedEvent, missing: result.missing };
      }
      
      // If we need more info but already extracted all necessary fields from the prompt
      if (result?.needsMoreInfo && result.remainingMissingFields.length === 0) {
        return generateEvent(prompt, modelProvider, result.prePopulatedInfo);
      }
      
      // If we need more info and specifically need budget
      if (result?.needsMoreInfo && 
          result.remainingMissingFields.includes('budget') && 
          !waitingForBudget) {
        requestBudgetInChat();
        setIsGenerating(false);
        return { needsBudget: true, data: result.data };
      }
      
      // If we have a valid result to return
      if (result) {
        // Update the prompt count if this is a new prompt
        if (!isResubmitting && result.validatedEvent && result.missing.length === 0) {
          setPromptCount(prev => prev + 1);
        }
        
        // Store missing info if needed
        if (result.needsMoreInfo) {
          setMissingInfo(result.data);
        }
        
        return result;
      }
      
      // If no valid data received
      throw new Error('Invalid response from event generation');

    } catch (error: any) {
      console.error('Error generating event:', error);
      
      // Add error message to chat
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: createErrorMessage()
      }]);
      
      return { error };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    promptCount,
    missingInfo,
    setMissingInfo,
    additionalInfo,
    setAdditionalInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    generateEvent,
    missingFields,
    previouslyRequestedFields
  };
};
