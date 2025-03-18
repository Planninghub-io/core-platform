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
import { findLastUserPrompt } from "../utils/chatUtils";

export const useEventGenerator = (
  chatMessages: ChatMessage[],
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

  // Helper function moved from eventValidation.ts to keep everything related to prompt extraction together
  const extractFieldsFromPrompt = (
    prompt: string, 
    data: any,
    providedInfo: Record<string, string> = {}
  ): Record<string, string> => {
    const prePopulatedInfo: Record<string, string> = {};
    
    // Match date patterns like "April 1st" or "April 1st, 2023"
    const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+(?:\d{4})?\s*(?:at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
    const simpleDateRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
    
    const dateTimeMatch = prompt.match(dateTimeRegex);
    const simpleDateMatch = !dateTimeMatch ? prompt.match(simpleDateRegex) : null;
    
    // Match location patterns like "in San Francisco" or "at Moscone Center"
    const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
    const locationMatch = prompt.match(locationRegex);

    // Match budget patterns like "$500", "500 dollars", "budget of $500"
    const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+)(?:\s+(?:dollars|USD))?/i;
    const budgetMatch = prompt.match(budgetRegex);

    if ((dateTimeMatch || simpleDateMatch) && (data.missingFields?.includes('date') || !data.date)) {
      const dateStr = dateTimeMatch ? dateTimeMatch[1] : (simpleDateMatch ? simpleDateMatch[1] : "");
      // If year is missing, add the current year
      const currentYear = new Date().getFullYear();
      const dateWithYear = dateStr.includes(String(currentYear)) ? dateStr : `${dateStr}, ${currentYear}`;
      
      try {
        const date = new Date(dateWithYear);
        if (!isNaN(date.getTime())) {
          prePopulatedInfo.date = date.toISOString();
        } else {
          prePopulatedInfo.date = dateStr; // Use the string as-is if parsing fails
        }
      } catch (e) {
        prePopulatedInfo.date = dateStr;
      }
    }
    
    if (locationMatch && (data.missingFields?.includes('location') || !data.location)) {
      const locationField = data.missingFields?.includes('location') ? 'location' : 'city';
      prePopulatedInfo[locationField] = locationMatch[1].trim();
    }

    if (budgetMatch && (data.missingFields?.includes('budget') || !data.estimatedPrice)) {
      prePopulatedInfo.budget = `$${budgetMatch[1]}`;
    }
    
    // Add any manually provided fields from providedInfo
    if (providedInfo.date) {
      prePopulatedInfo.date = providedInfo.date;
      // Remove date from missing fields if it was provided
      if (data.missingFields?.includes('date')) {
        data.missingFields = data.missingFields.filter((f: string) => f !== 'date');
      }
    }
    
    if (providedInfo.location) {
      prePopulatedInfo.location = providedInfo.location;
      // Remove location from missing fields if it was provided
      if (data.missingFields?.includes('location')) {
        data.missingFields = data.missingFields.filter((f: string) => f !== 'location');
      }
    }
    
    if (providedInfo.budget) {
      prePopulatedInfo.budget = providedInfo.budget;
      // Remove budget from missing fields if it was provided
      if (data.missingFields?.includes('budget')) {
        data.missingFields = data.missingFields.filter((f: string) => f !== 'budget');
      }
    }

    return prePopulatedInfo;
  };

  // Function to regenerate an event with updated info after getting missing details
  const regenerateEventWithUpdatedInfo = async (additionalInfo: Record<string, string>) => {
    const lastUserPrompt = findLastUserPrompt(chatMessages);
    if (lastUserPrompt) {
      console.log("Regenerating event with additional info:", additionalInfo);
      return generateEvent(lastUserPrompt, additionalInfo);
    }
    return { error: new Error("No valid prompt found for regeneration") };
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
    regenerateEventWithUpdatedInfo
  };
};
