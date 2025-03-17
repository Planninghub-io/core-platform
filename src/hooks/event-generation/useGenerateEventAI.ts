
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedEvent, MissingInfo } from "./types";
import { generateEventAPI } from "./api/generateEventAPI";
import { validateEventData, extractFieldsFromPrompt } from "./utils/eventValidation";
import { 
  formatMissingFieldsMessage, 
  createSuccessMessage, 
  createMissingInfoMessage,
  createErrorMessage
} from "./utils/chatMessageUtils";

export const useGenerateEventAI = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const generateEvent = async (prompt: string, providedInfo: Record<string, string> = {}) => {
    setIsGenerating(true);
    
    try {
      // Combine the existing additional info with provided info
      const combinedInfo = { ...additionalInfo, ...providedInfo };
      
      // Call the API
      const response = await generateEventAPI({
        prompt,
        additionalInfo: combinedInfo
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;

      // If we received a proper event response
      if (data && (data.title || data.description || data.location)) {
        // Validate the event data
        const { validatedEvent, missing } = validateEventData(data, providedInfo);
        
        setMissingFields(missing);
        
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
        } else {
          // If we have missing fields, ask the user for them
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: formatMissingFieldsMessage(missing)
          }]);
        }
        
        return { validatedEvent, missing, error: null };
      } 
      // Handle missing info response
      else if (data && data.needsInfo === true) {
        if (!isResubmitting) {
          // Extract information from prompt
          const prePopulatedInfo = extractFieldsFromPrompt(prompt, data);
          
          // Add any manually provided fields from providedInfo
          if (providedInfo.date) {
            prePopulatedInfo.date = providedInfo.date;
            // Remove date from missing fields if it was provided
            if (data.missingFields?.includes('date')) {
              data.missingFields = data.missingFields.filter(f => f !== 'date');
            }
          }
          
          if (providedInfo.location) {
            prePopulatedInfo.location = providedInfo.location;
            // Remove location from missing fields if it was provided
            if (data.missingFields?.includes('location')) {
              data.missingFields = data.missingFields.filter(f => f !== 'location');
            }
          }

          setAdditionalInfo(prePopulatedInfo);
          setMissingInfo(data);
          setIsResubmitting(true);
          setMissingFields(data.missingFields || []);
          
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
    chatMessages,
    setChatMessages,
    missingFields
  };
};
