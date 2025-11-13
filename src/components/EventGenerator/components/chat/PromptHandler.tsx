
import { useCallback, useRef, useState } from "react";
import { extractDateFromPrompt } from "@/hooks/event-generation/utils/prompt-extraction/dateExtractor";
import { extractLocationFromPrompt } from "@/hooks/event-generation/utils/prompt-extraction/locationExtractor";
import { chatAssistantAPI } from "@/hooks/event-generation/api/chatAssistantAPI";

interface PromptHandlerProps {
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string, suggestions?: string[] }>>>;
  setSelectedDate?: (date: string) => void;
  setLocation?: (location: string) => void;
  setPrompt: (prompt: string) => void;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  modelProvider: 'openai' | 'anthropic';
}

export const usePromptHandler = ({
  setChatMessages,
  setSelectedDate,
  setLocation,
  setPrompt,
  handlePromptSubmit,
  modelProvider
}: PromptHandlerProps) => {
  const lastSubmissionRef = useRef<{ prompt: string, timestamp: number } | null>(null);
  const [pendingInfo, setPendingInfo] = useState<{
    date?: string;
    location?: string;
    description?: string;
    originalPrompt?: string;
    eventType?: string;
  }>({});
  const [requiredFieldsCollected, setRequiredFieldsCollected] = useState(false);
  const [askedForFields, setAskedForFields] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isGettingAIResponse, setIsGettingAIResponse] = useState(false);
  
  const hasMissingFields = !pendingInfo.date || !pendingInfo.location || !pendingInfo.eventType;
  
  const logState = (action: string, state: any) => {
    console.log(`PromptHandler [${action}]:`, JSON.stringify(state));
  };
  
  const handleSubmit = useCallback(async (userPrompt: string) => {
    if (!userPrompt || userPrompt.trim() === '') return;
    
    console.log("PromptHandler: Submit button clicked with prompt:", userPrompt);
    
    const now = Date.now();
    if (lastSubmissionRef.current && 
        lastSubmissionRef.current.prompt === userPrompt && 
        now - lastSubmissionRef.current.timestamp < 3000) {
      console.log("PromptHandler: Ignoring duplicate submission within 3 seconds");
      return;
    }
    
    setChatMessages(prev => [...prev, { type: 'user', content: userPrompt }]);
    
    // Add to conversation history
    const updatedHistory = [...conversationHistory, { role: 'user', content: userPrompt }];
    setConversationHistory(updatedHistory);
    
    const eventTypeRegex = /(birthday|wedding|party|meeting|conference|dinner|lunch|brunch|gathering|ceremony|celebration|corporate|team building|reception)/i;
    const eventTypeMatch = userPrompt.match(eventTypeRegex);
    const extractedEventType = eventTypeMatch ? eventTypeMatch[0] : null;
    
    // Get conversational AI response
    setIsGettingAIResponse(true);
    try {
      const aiResponse = await chatAssistantAPI({
        messages: updatedHistory,
        modelProvider,
        context: {
          hasDate: Boolean(pendingInfo.date || extractDateFromPrompt(userPrompt)),
          hasLocation: Boolean(pendingInfo.location || extractLocationFromPrompt(userPrompt)),
          hasEventType: Boolean(pendingInfo.eventType || extractedEventType),
          collectedInfo: {
            ...pendingInfo,
            date: pendingInfo.date || extractDateFromPrompt(userPrompt),
            location: pendingInfo.location || extractLocationFromPrompt(userPrompt),
            eventType: pendingInfo.eventType || extractedEventType,
          },
        },
      });
      
      // Add AI response to conversation history
      const newHistory = [...updatedHistory, { role: 'assistant', content: aiResponse.message }];
      setConversationHistory(newHistory);
      
      // Add AI response to chat messages with suggestions
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse.message,
        id: `ai-response-${Date.now()}`,
        suggestions: aiResponse.suggestions,
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to original behavior if AI fails
    } finally {
      setIsGettingAIResponse(false);
    }
    
    if (pendingInfo.originalPrompt) {
      console.log("PromptHandler: Processing follow-up information for original prompt");
      
      const extractedDate = extractDateFromPrompt(userPrompt);
      const extractedLocation = extractLocationFromPrompt(userPrompt);
      
      const updatedInfo = { 
        ...pendingInfo,
      };
      
      if (extractedDate) {
        updatedInfo.date = extractedDate;
        console.log("PromptHandler: Extracted date:", extractedDate);
      }
      
      if (extractedLocation) {
        updatedInfo.location = extractedLocation;
        console.log("PromptHandler: Extracted location:", extractedLocation);
      }
      
      if (extractedEventType) {
        updatedInfo.eventType = extractedEventType;
        console.log("PromptHandler: Extracted event type:", extractedEventType);
      }
      
      if (!extractedLocation && 
          !extractedDate && 
          !extractedEventType &&
          askedForFields.includes('location') &&
          userPrompt.split(' ').length <= 4) {
        updatedInfo.location = userPrompt.trim();
        console.log("PromptHandler: Treating response as location:", userPrompt);
      }
      
      if (!extractedDate && 
          !extractedLocation && 
          !extractedEventType &&
          askedForFields.includes('date') && 
          /\d/.test(userPrompt)) {
        updatedInfo.date = userPrompt.trim();
        console.log("PromptHandler: Treating response as date:", userPrompt);
      }
      
      setPendingInfo(updatedInfo);
      logState("Updated pending info", updatedInfo);
      
      if (updatedInfo.date && setSelectedDate && updatedInfo.date !== pendingInfo.date) {
        setSelectedDate(updatedInfo.date);
      }
      
      if (updatedInfo.location && setLocation && updatedInfo.location !== pendingInfo.location) {
        setLocation(updatedInfo.location);
      }
      
      const hasAllRequiredInfo = Boolean(
        updatedInfo.date && 
        updatedInfo.location && 
        (updatedInfo.eventType || extractedEventType)
      );
      
      if (hasAllRequiredInfo) {
        console.log("PromptHandler: All required info collected, proceeding with request");
        
        let completePrompt = pendingInfo.originalPrompt || "";
        if (updatedInfo.date || updatedInfo.location) {
          completePrompt += ` The event will be on ${updatedInfo.date} at ${updatedInfo.location}.`;
        }
        if (updatedInfo.eventType) {
          completePrompt += ` It's a ${updatedInfo.eventType} event.`;
        }
        
        console.log("PromptHandler: Complete prompt:", completePrompt);
        
        setRequiredFieldsCollected(true);
        
        // The AI response above should have already been added, so we proceed directly
        lastSubmissionRef.current = { prompt: completePrompt, timestamp: now };
        
        setTimeout(() => {
          handlePromptSubmit(completePrompt, modelProvider);
        }, 1000); // Give user time to see the AI response
        
        setPrompt("");
        
        setPendingInfo({});
        setAskedForFields([]);
        setConversationHistory([]); // Reset conversation history after event creation
        return;
      } else {
        let missingFieldsMessage = "I still need more information to create your event. ";
        const newAskedForFields = [...askedForFields];
        
        if (!updatedInfo.date && !askedForFields.includes('date')) {
          missingFieldsMessage += "When will the event take place? ";
          newAskedForFields.push('date');
        } else if (!updatedInfo.location && !askedForFields.includes('location')) {
          missingFieldsMessage += "Where will the event be held? ";
          newAskedForFields.push('location');
        } else if (!updatedInfo.eventType && !askedForFields.includes('eventType')) {
          missingFieldsMessage += "What type of event is this (birthday, wedding, meeting, etc.)? ";
          newAskedForFields.push('eventType');
        } else if (!updatedInfo.date) {
          missingFieldsMessage += "When will the event take place? ";
        } else if (!updatedInfo.location) {
          missingFieldsMessage += "Where will the event be held? ";
        } else if (!updatedInfo.eventType) {
          missingFieldsMessage += "What type of event is this (birthday, wedding, meeting, etc.)? ";
        }
        
        setAskedForFields(newAskedForFields);
        logState("Asked for fields", newAskedForFields);
        
        // The AI response above should have already been added, so we just return
        setPrompt("");
        return;
      }
    }
    
    // This is the first prompt - check if we have all required fields
    const extractedDate = extractDateFromPrompt(userPrompt);
    const extractedLocation = extractLocationFromPrompt(userPrompt);
    
    const newPendingInfo = {
      originalPrompt: userPrompt,
      description: userPrompt,
      date: extractedDate,
      location: extractedLocation,
      eventType: extractedEventType
    };
    
    const hasAllRequiredInfo = Boolean(
      newPendingInfo.date && 
      newPendingInfo.location && 
      newPendingInfo.eventType
    );
    
    if (extractedDate && setSelectedDate) {
      setSelectedDate(extractedDate);
    }
    
    if (extractedLocation && setLocation) {
      setLocation(extractedLocation);
    }
    
    if (!hasAllRequiredInfo) {
      console.log("PromptHandler: Missing required fields in prompt, asking user for more information");
      
      setPendingInfo(newPendingInfo);
      logState("New pending info", newPendingInfo);
      
      // Create a more informative message asking for all missing fields at once
      let missingFieldsMessage = "To help you plan your event, I need the following details:\n";
      const newAskedForFields = [];
      
      if (!newPendingInfo.date) {
        missingFieldsMessage += "• When will the event take place?\n";
        newAskedForFields.push('date');
      }
      
      if (!newPendingInfo.location) {
        missingFieldsMessage += "• Where will the event be held?\n";
        newAskedForFields.push('location');
      }
      
      if (!newPendingInfo.eventType) {
        missingFieldsMessage += "• What type of event is this (birthday, wedding, meeting, etc.)?\n";
        newAskedForFields.push('eventType');
      }
      
      missingFieldsMessage += "\nPlease provide these details so I can create your event.";
      
      setAskedForFields(newAskedForFields);
      logState("Initially asked for fields", newAskedForFields);
      
      // The AI response above should have already been added, so we just return
      setPrompt("");
      return;
    }
    
    console.log("PromptHandler: All required fields present, proceeding with API call");
    
    setRequiredFieldsCollected(true);
    
    // The AI response above should have already been added, so we proceed
    setPrompt("");
    
    lastSubmissionRef.current = { prompt: userPrompt, timestamp: now };
    
    setTimeout(() => {
      console.log("PromptHandler: Calling parent handlePromptSubmit with model:", modelProvider);
      handlePromptSubmit(userPrompt, modelProvider);
    }, 1000); // Give user time to see the AI response
  }, [pendingInfo, askedForFields, modelProvider, setChatMessages, setSelectedDate, setLocation, setPrompt, handlePromptSubmit, conversationHistory]);

  return {
    handleSubmit,
    pendingInfo,
    requiredFieldsCollected,
    hasMissingFields,
    isGettingAIResponse
  };
};
