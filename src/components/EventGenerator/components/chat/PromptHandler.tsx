
import { useCallback, useRef, useState } from "react";
import { checkPromptForRequiredFields, trackPendingInformation } from "@/hooks/event-generation/utils/promptPreChecker";

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
  }>({});
  const [requiredFieldsCollected, setRequiredFieldsCollected] = useState(false);
  
  // Check if we have all the required fields
  const hasMissingFields = !pendingInfo.date || !pendingInfo.location;
  
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
    
    // If we're in the middle of gathering information for an initial prompt
    if (pendingInfo.originalPrompt) {
      console.log("PromptHandler: Processing follow-up information for original prompt");
      
      const { updatedInfo, shouldProceed, completePrompt } = trackPendingInformation(
        pendingInfo.originalPrompt,
        pendingInfo,
        userPrompt
      );
      
      // Update our pending info state with any new extracted data
      setPendingInfo({ 
        ...updatedInfo, 
        originalPrompt: pendingInfo.originalPrompt 
      });
      
      // Update date and location if provided
      if (updatedInfo.date && setSelectedDate) {
        setSelectedDate(updatedInfo.date);
      }
      
      if (updatedInfo.location && setLocation) {
        setLocation(updatedInfo.location);
      }
      
      // If we now have all required info, proceed with the API call
      if (shouldProceed) {
        console.log("PromptHandler: All required info collected, proceeding with request");
        console.log("PromptHandler: Complete prompt:", completePrompt);
        
        // Set the required fields as collected
        setRequiredFieldsCollected(true);
        
        // Add AI message indicating we're generating the event
        setChatMessages(prev => [...prev, { 
          type: 'ai', 
          content: "I have all the required details. Let me generate the event for you to review and create."
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
        // Still missing info, clear input for user to provide more
        setPrompt("");
        return;
      }
    }
    
    // First time prompt submission - check if it has all required fields
    const { shouldProceed, extractedInfo } = checkPromptForRequiredFields(
      userPrompt,
      setChatMessages
    );
    
    // If not all required fields are present, store what we have and wait for more info
    if (!shouldProceed) {
      console.log("PromptHandler: Missing required fields in prompt, asking user for more information");
      // Store the original prompt and any extracted info
      setPendingInfo({
        originalPrompt: userPrompt,
        description: userPrompt,
        ...extractedInfo
      });
      
      // Update date and location if extracted
      if (extractedInfo.date && setSelectedDate) {
        setSelectedDate(extractedInfo.date);
      }
      
      if (extractedInfo.location && setLocation) {
        setLocation(extractedInfo.location);
      }
      
      setPrompt(""); // Clear input for user to add more info
      return;
    }
    
    // If we have all required fields, proceed with the API call
    console.log("PromptHandler: All required fields present, proceeding with API call");
    
    // Update date and location if provided
    if (extractedInfo.date && setSelectedDate) {
      setSelectedDate(extractedInfo.date);
    }
    
    if (extractedInfo.location && setLocation) {
      setLocation(extractedInfo.location);
    }
    
    // Set the required fields as collected
    setRequiredFieldsCollected(true);
    
    // Add AI message indicating we're generating the event
    setChatMessages(prev => [...prev, { 
      type: 'ai', 
      content: "I have all the required details. Let me generate the event for you to review and create."
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
