
import { generateEventWithAPI } from "./eventGenerationAPI";
import { extractInfoFromPrompt } from "../utils/promptExtractor";
import { ChatMessage } from "../../types";
import { SubmissionResult, GenerateEventResponse } from "../../types/api-types";
import { processResponse } from "../utils/responseProcessor";
import { createErrorMessage } from "../../utils/chatMessageUtils";

/**
 * Submit prompt to the API and process the response
 */
export const submitPrompt = async (
  prompt: string,
  modelProvider: 'openai' | 'anthropic',
  additionalInfo: Record<string, string>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void,
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
): Promise<SubmissionResult> => {
  // Validate the prompt
  if (!prompt || prompt.trim() === "") {
    console.log("submitPrompt: Empty prompt, not submitting");
    return { error: new Error("Please enter an event description") };
  }
  
  console.log("submitPrompt: Starting prompt submission with model:", modelProvider);
  console.log("submitPrompt: Prompt content:", prompt);
  
  // Extract additional information from the prompt
  const extractedInfo = extractInfoFromPrompt(prompt);
  console.log("submitPrompt: Extracted info from prompt:", extractedInfo);
  
  const combinedInfo = { ...additionalInfo, ...extractedInfo };
  console.log("submitPrompt: Combined info for API call:", combinedInfo);
  
  setIsGenerating(true);
  
  try {
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);
    
    // Add loading message
    setChatMessages(prev => [...prev, { type: 'ai', content: "Generating your event details..." }]);
    
    // Generate the event
    console.log("submitPrompt: Calling generateEventWithAPI");
    const response = await generateEventWithAPI(
      prompt,
      modelProvider,
      combinedInfo
    ) as GenerateEventResponse;
    
    console.log("submitPrompt: Received API response:", JSON.stringify(response, null, 2));
    
    // Remove loading message
    setChatMessages(prev => {
      const newMessages = [...prev];
      return newMessages.filter((msg, index) => 
        !(index === newMessages.length - 1 && msg.type === 'ai' && msg.content === "Generating your event details...")
      );
    });
    
    if (response.error) {
      console.error("submitPrompt: Error in API response:", response.error);
      throw response.error;
    }
    
    // Process the response and handle missing fields
    console.log("submitPrompt: Processing API response through processResponse");
    const processed = processResponse(
      response, 
      setChatMessages, 
      waitingForBudget, 
      requestBudgetInChat, 
      setPreviouslyRequestedFields
    );
    
    console.log("submitPrompt: ProcessResponse result:", processed);
    
    // If we processed the response successfully
    if (processed) {
      // Update prompt count for non-resubmissions with complete data
      if (!isResubmitting && processed.missing && processed.missing.length === 0) {
        setPromptCount(prev => prev + 1);
      }
      
      return processed;
    }
    
    // If we couldn't process the response, show a generic success message
    console.log("submitPrompt: Could not process response, showing generic success message");
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: "I've generated an event based on your request. Please review the details."
    }]);
    
    // Return a default result with the data from the API
    return { 
      validatedEvent: response.data,
      missing: response.missing || []
    };
    
  } catch (error: any) {
    console.error("submitPrompt: Error submitting prompt:", error);
    
    // Remove loading message if it exists
    setChatMessages(prev => {
      return prev.filter(msg => 
        !(msg.type === 'ai' && msg.content === "Generating your event details...")
      );
    });
    
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
