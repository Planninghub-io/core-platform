
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateEventAPI } from "../api/generateEventAPI";
import { validateEventData } from "../utils/eventValidation";
import { 
  formatMissingFieldsMessage, 
  createSuccessMessage, 
  createMissingInfoMessage,
  createErrorMessage
} from "../utils/chatMessageUtils";
import { ChatMessage, GeneratedEvent, MissingInfo } from "../types";
import { extractFieldsFromPrompt } from "../utils/promptExtraction";

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
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  /**
   * Generate an event based on a prompt and additional information
   */
  const generateEvent = async (prompt: string, providedInfo: Record<string, string> = {}) => {
    setIsGenerating(true);
    
    try {
      // Combine the existing additional info with provided info
      const combinedInfo = { ...additionalInfo, ...providedInfo };
      
      // Log the combined info for debugging
      console.log("Combined info before API call:", combinedInfo);
      console.log("Sending prompt to generate event:", prompt);
      
      // Call the API
      const response = await generateEventAPI({
        prompt,
        additionalInfo: combinedInfo
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      console.log("Received response from generate-event:", data);

      // If we received a proper event response
      if (data && (data.title || data.description || data.location)) {
        // Validate the event data
        const { validatedEvent, missing } = validateEventData(data, providedInfo);
        
        console.log("Created validated event:", validatedEvent);
        console.log("Missing fields:", missing);
        
        setMissingFields(missing);
        
        // Check if we're missing budget specifically
        if (missing.includes('budget') && !waitingForBudget) {
          requestBudgetInChat();
          setIsGenerating(false);
          return { needsBudget: true, validatedEvent, missing };
        }
        
        // Only set generated event if we have all required fields
        if (missing.length === 0) {
          setGeneratedEvent(validatedEvent);
          setMissingInfo(null);
          setAdditionalInfo({});
          setIsResubmitting(false);
          
          if (!isResubmitting) {
            setPromptCount(prev => prev + 1);
          }
          
          // Add success message to chat when all required data is provided
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: createSuccessMessage(validatedEvent.title)
          }]);
          
          return { validatedEvent, missing: [], error: null };
        } else {
          // If we have missing fields, ask the user for them
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: formatMissingFieldsMessage(missing)
          }]);
          
          return { validatedEvent, missing, error: null };
        }
      } 
      // Handle missing info response
      else if (data && data.needsInfo === true) {
        if (!isResubmitting) {
          // Extract information from prompt
          const prePopulatedInfo = extractFieldsFromPrompt(prompt, data, providedInfo);
          
          setAdditionalInfo(prePopulatedInfo);
          setMissingInfo(data);
          setIsResubmitting(true);
          setMissingFields(data.missingFields || []);
          
          // Check if we need budget specifically
          if (data.missingFields.includes('budget') && !waitingForBudget) {
            requestBudgetInChat();
            setIsGenerating(false);
            return { needsBudget: true, data };
          }
          
          // If we have all the required fields after applying provided info,
          // we should generate the event again with the complete info
          if (data.missingFields.length === 0) {
            return generateEvent(prompt, prePopulatedInfo);
          }
          
          // Add AI message to chat
          setChatMessages(prev => [...prev, {
            type: 'ai', 
            content: createMissingInfoMessage(data.missingFields)
          }]);
          
          return { needsMoreInfo: true, data };
        }
      } else {
        // No valid data received
        throw new Error('Invalid response from event generation');
      }

      // If execution reaches here, handle as error
      throw new Error('Failed to generate event details');

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
    missingFields
  };
};
