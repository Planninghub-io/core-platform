
import { useCallback, useRef, useState } from "react";
import { extractDateFromPrompt } from "@/hooks/event-generation/utils/prompt-extraction/dateExtractor";
import { extractLocationFromPrompt } from "@/hooks/event-generation/utils/prompt-extraction/locationExtractor";

interface PromptHandlerProps {
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string }>>>;
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
  
  // Check if we have all the required fields
  const hasMissingFields = !pendingInfo.date || !pendingInfo.location || !pendingInfo.eventType;
  
  // Create a new wrapper for the submit handler with optimized checks
  const handleSubmit = useCallback((userPrompt: string) => {
    if (!userPrompt || userPrompt.trim() === '') return;
    
    console.log("PromptHandler: Submit button clicked with prompt:", userPrompt);
    
    // Check for duplicate submissions
    const now = Date.now();
    if (lastSubmissionRef.current && 
        lastSubmissionRef.current.prompt === userPrompt && 
        now - lastSubmissionRef.current.timestamp < 3000) {
      console.log("PromptHandler: Ignoring duplicate submission within 3 seconds");
      return;
    }
    
    // Add the user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: userPrompt }]);
    
    // Extract event type from prompt
    const eventTypeRegex = /(birthday|wedding|party|meeting|conference|dinner|lunch|brunch|gathering|ceremony|celebration|corporate|team building|reception)/i;
    const eventTypeMatch = userPrompt.match(eventTypeRegex);
    const extractedEventType = eventTypeMatch ? eventTypeMatch[0] : null;
    
    // If we're in the middle of gathering information for an initial prompt
    if (pendingInfo.originalPrompt) {
      console.log("PromptHandler: Processing follow-up information for original prompt");
      
      // Extract date and location from the new prompt
      const extractedDate = extractDateFromPrompt(userPrompt);
      const extractedLocation = extractLocationFromPrompt(userPrompt);
      
      // Update our pending info with any new extracted data
      const updatedInfo = { 
        ...pendingInfo,
        date: extractedDate || pendingInfo.date,
        location: extractedLocation || pendingInfo.location,
        eventType: extractedEventType || pendingInfo.eventType
      };
      
      setPendingInfo(updatedInfo);
      
      // Update date and location if provided
      if (updatedInfo.date && setSelectedDate) {
        setSelectedDate(updatedInfo.date);
      }
      
      if (updatedInfo.location && setLocation) {
        setLocation(updatedInfo.location);
      }
      
      // Check if we now have all required information
      const hasAllRequiredInfo = Boolean(
        updatedInfo.date && 
        updatedInfo.location && 
        (updatedInfo.eventType || extractedEventType)
      );
      
      // If we now have all required info, proceed with the API call
      if (hasAllRequiredInfo) {
        console.log("PromptHandler: All required info collected, proceeding with request");
        
        // Construct a complete prompt with all gathered information
        let completePrompt = pendingInfo.originalPrompt || "";
        if (extractedDate || extractedLocation) {
          completePrompt += ` The event will be on ${updatedInfo.date} at ${updatedInfo.location}.`;
        }
        if (updatedInfo.eventType) {
          completePrompt += ` It's a ${updatedInfo.eventType} event.`;
        }
        
        console.log("PromptHandler: Complete prompt:", completePrompt);
        
        // Set the required fields as collected
        setRequiredFieldsCollected(true);
        
        // Add AI message indicating we're generating the event
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: "Great! I have all the required details. Let me generate your event plan for you to review."
        }]);
        
        // Call the handler with the complete prompt
        lastSubmissionRef.current = { prompt: completePrompt, timestamp: now };
        
        // Force a small delay to ensure the message appears before API call
        setTimeout(() => {
          handlePromptSubmit(completePrompt, modelProvider);
        }, 100);
        
        // Clear the input for better UX
        setPrompt("");
        
        // Clear pending info since we're done collecting
        setPendingInfo({});
        return;
      } else {
        // Still missing info, ask for what's missing
        let missingFieldsMessage = "I still need more information to create your event. ";
        
        if (!updatedInfo.date) {
          missingFieldsMessage += "When will the event take place? ";
        }
        if (!updatedInfo.location) {
          missingFieldsMessage += "Where will the event be held? ";
        }
        if (!updatedInfo.eventType) {
          missingFieldsMessage += "What type of event is this (birthday, wedding, meeting, etc.)? ";
        }
        
        setChatMessages(prev => [...prev, { type: 'ai', content: missingFieldsMessage }]);
        
        // Clear input for user to provide more
        setPrompt("");
        return;
      }
    }
    
    // First time prompt submission - check if it has all required fields
    const extractedDate = extractDateFromPrompt(userPrompt);
    const extractedLocation = extractLocationFromPrompt(userPrompt);
    
    // Store the original prompt and any extracted info
    const newPendingInfo = {
      originalPrompt: userPrompt,
      description: userPrompt,
      date: extractedDate,
      location: extractedLocation,
      eventType: extractedEventType
    };
    
    // Check if all required fields are present
    const hasAllRequiredInfo = Boolean(
      newPendingInfo.date && 
      newPendingInfo.location && 
      newPendingInfo.eventType
    );
    
    // Update date and location if extracted
    if (extractedDate && setSelectedDate) {
      setSelectedDate(extractedDate);
    }
    
    if (extractedLocation && setLocation) {
      setLocation(extractedLocation);
    }
    
    // If not all required fields are present, store what we have and wait for more info
    if (!hasAllRequiredInfo) {
      console.log("PromptHandler: Missing required fields in prompt, asking user for more information");
      
      setPendingInfo(newPendingInfo);
      
      // Generate a message asking for missing info
      let missingFieldsMessage = "I'd like to help plan your event, but I need a few more details: ";
      
      if (!newPendingInfo.date) {
        missingFieldsMessage += "When will the event take place? ";
      }
      if (!newPendingInfo.location) {
        missingFieldsMessage += "Where will the event be held? ";
      }
      if (!newPendingInfo.eventType) {
        missingFieldsMessage += "What type of event is this (birthday, wedding, meeting, etc.)? ";
      }
      
      // Add AI message asking for missing info
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: missingFieldsMessage
      }]);
      
      setPrompt(""); // Clear input for user to add more info
      return;
    }
    
    // If we have all required fields, proceed with the API call
    console.log("PromptHandler: All required fields present, proceeding with API call");
    
    // Set the required fields as collected
    setRequiredFieldsCollected(true);
    
    // Add AI message indicating we're generating the event
    setChatMessages(prev => [...prev, { 
      type: 'ai', 
      content: "Great! I have all the required details. Let me generate your event plan for you to review."
    }]);
    
    // Clear the input for better UX
    setPrompt("");
    
    // Update last submission reference
    lastSubmissionRef.current = { prompt: userPrompt, timestamp: now };
    
    // Force a small delay to ensure the message appears before API call
    setTimeout(() => {
      // Call the parent handlePromptSubmit with the model provider
      console.log("PromptHandler: Calling parent handlePromptSubmit with model:", modelProvider);
      handlePromptSubmit(userPrompt, modelProvider);
    }, 100);
  }, [pendingInfo, modelProvider, setChatMessages, setSelectedDate, setLocation, setPrompt, handlePromptSubmit]);

  return {
    handleSubmit,
    pendingInfo,
    requiredFieldsCollected,
    hasMissingFields
  };
};
