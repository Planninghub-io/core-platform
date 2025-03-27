
import { useState } from "react";
import { ChatMessage, GeneratedEvent, MissingInfo } from "../types";
import { validateEventData } from "../utils/eventValidation";
import { extractFieldsFromPrompt } from "../utils/prompt-extraction";
import { 
  createSuccessMessage, 
  formatMissingFieldsMessage 
} from "../utils/chatMessageUtils";

/**
 * Hook for processing and validating event data
 */
export const useEventProcessor = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void,
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  /**
   * Process API response containing an event or missing information
   */
  const processEventResponse = (
    data: any, 
    prompt: string,
    providedInfo: Record<string, string> = {}
  ) => {
    // Debug logging
    console.log("processEventResponse: Processing response with data:", data);
    
    // If we received a proper event response
    if (data && (data.title || data.description || data.location)) {
      // Validate the event data
      const { validatedEvent, missing } = validateEventData(data, providedInfo);
      
      console.log("processEventResponse: Created validated event:", validatedEvent);
      console.log("processEventResponse: Missing fields:", missing);
      
      setMissingFields(missing);
      
      // Check if we're missing budget specifically
      if (missing.includes('budget') && !waitingForBudget) {
        requestBudgetInChat();
        return { needsBudget: true, validatedEvent, missing };
      }
      
      // Only set generated event if we have all required fields
      if (missing.length === 0) {
        // Important: update the generatedEvent state with the validated event data
        setGeneratedEvent(validatedEvent);
        console.log("processEventResponse: Setting complete generated event:", validatedEvent);
        
        setAdditionalInfo({});
        setIsResubmitting(false);
        setPreviouslyRequestedFields([]);
        
        // Add success message to chat when all required data is provided
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: createSuccessMessage(validatedEvent.title)
        }]);
        
        return { validatedEvent, missing: [], error: null };
      } else {
        // Update previously requested fields to track what we're asking for
        setPreviouslyRequestedFields(missing);
        
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
      console.log("processEventResponse: Handling missing info response");
      
      if (!isResubmitting) {
        // Extract information from prompt
        const prePopulatedInfo = extractFieldsFromPrompt(prompt, data, providedInfo);
        
        // Log what we extracted
        console.log("processEventResponse: Extracted info from prompt:", prePopulatedInfo);
        
        setAdditionalInfo(prePopulatedInfo);
        setIsResubmitting(true);
        
        // Update missing fields, filtering out those we've already extracted
        const remainingMissingFields = (data.missingFields || []).filter(field => 
          !prePopulatedInfo[field]
        );
        
        setMissingFields(remainingMissingFields);
        
        // Update fields we're asking about
        setPreviouslyRequestedFields(remainingMissingFields);
        
        return { 
          needsMoreInfo: true, 
          data, 
          prePopulatedInfo, 
          remainingMissingFields 
        };
      }
    } else {
      console.error("processEventResponse: Invalid or unexpected response format:", data);
    }
    
    return null;
  };

  return {
    additionalInfo,
    setAdditionalInfo,
    isResubmitting,
    setIsResubmitting,
    generatedEvent,
    setGeneratedEvent,
    missingFields,
    processEventResponse
  };
};
