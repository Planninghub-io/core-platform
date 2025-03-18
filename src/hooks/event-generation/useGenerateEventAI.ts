
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedEvent, MissingInfo, ChatMessage } from "./types";
import { generateEventAPI } from "./api/generateEventAPI";
import { validateEventData, extractFieldsFromPrompt } from "./utils/eventValidation";
import { 
  formatMissingFieldsMessage, 
  createSuccessMessage, 
  createMissingInfoMessage,
  createErrorMessage,
  createBudgetRequestMessage
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
  const [waitingForBudget, setWaitingForBudget] = useState(false);

  useEffect(() => {
    // If we're waiting for budget and the last message was from the user, 
    // check if it contains budget information
    if (waitingForBudget && chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'user') {
      const lastMessage = chatMessages[chatMessages.length - 1].content;
      
      // Try to extract budget from user's message
      const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+)(?:\s+(?:dollars|USD))?/i;
      const budgetMatch = lastMessage.match(budgetRegex);
      
      if (budgetMatch) {
        // If budget is found, update additionalInfo
        const extractedBudget = `$${budgetMatch[1]}`;
        setAdditionalInfo(prev => ({ ...prev, budget: extractedBudget }));
        setWaitingForBudget(false);
        
        // Re-generate the event with the budget info
        const lastUserPrompt = findLastUserPrompt();
        if (lastUserPrompt) {
          // Create a new additionalInfo object with the budget
          const updatedInfo = { ...additionalInfo, budget: extractedBudget };
          
          // Generate the event with the updated info
          generateEvent(lastUserPrompt, updatedInfo);
        }
      } else if (lastMessage.toLowerCase().includes('free') || lastMessage.toLowerCase().includes('no budget')) {
        // Handle "free" event case
        setAdditionalInfo(prev => ({ ...prev, budget: 'Free' }));
        setWaitingForBudget(false);
        
        // Re-generate the event with the free budget info
        const lastUserPrompt = findLastUserPrompt();
        if (lastUserPrompt) {
          const updatedInfo = { ...additionalInfo, budget: 'Free' };
          generateEvent(lastUserPrompt, updatedInfo);
        }
      }
    }
  }, [chatMessages, waitingForBudget]);

  const findLastUserPrompt = () => {
    // Find the last user message that isn't just answering a specific question
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].type === 'user') {
        // Skip messages that are just answering budget/date/location questions
        const content = chatMessages[i].content.toLowerCase();
        
        // Simple heuristic: if the message is just a number, date, or location, skip it
        if (!/^\$?\d+$/.test(content) && 
            !content.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)/i) &&
            !content.match(/^(in|at) /i)) {
          return chatMessages[i].content;
        }
      }
    }
    
    // If we couldn't find a good prompt, use the first user message
    const firstUserMessage = chatMessages.find(msg => msg.type === 'user');
    return firstUserMessage ? firstUserMessage.content : '';
  };

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
          setWaitingForBudget(true);
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: createBudgetRequestMessage()
          }]);
          setIsGenerating(false);
          return { needsBudget: true, validatedEvent, missing };
        }
        
        // Only set generated event if we have all required fields
        if (missing.length === 0) {
          setGeneratedEvent(validatedEvent);
          setMissingInfo(null);
          setAdditionalInfo({});
          setIsResubmitting(false);
          setWaitingForBudget(false);
          
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
          
          if (providedInfo.budget) {
            prePopulatedInfo.budget = providedInfo.budget;
            // Remove budget from missing fields if it was provided
            if (data.missingFields?.includes('budget')) {
              data.missingFields = data.missingFields.filter(f => f !== 'budget');
            }
          }

          setAdditionalInfo(prePopulatedInfo);
          setMissingInfo(data);
          setIsResubmitting(true);
          setMissingFields(data.missingFields || []);
          
          // Check if we need budget specifically
          if (data.missingFields.includes('budget') && !waitingForBudget) {
            setWaitingForBudget(true);
            setChatMessages(prev => [...prev, {
              type: 'ai',
              content: createBudgetRequestMessage()
            }]);
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
    chatMessages,
    setChatMessages,
    missingFields,
    waitingForBudget,
    setWaitingForBudget
  };
};
