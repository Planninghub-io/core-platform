
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
  isResubmitting: boolean,
  apiCallId: string = 'default'
): Promise<SubmissionResult> => {
  // Validate the prompt
  if (!prompt || prompt.trim() === "") {
    console.log(`submitPrompt [${apiCallId}]: Empty prompt, not submitting`);
    return { error: new Error("Please enter an event description") };
  }
  
  console.log(`submitPrompt [${apiCallId}]: Starting prompt submission with model:`, modelProvider);
  console.log(`submitPrompt [${apiCallId}]: Prompt content:`, prompt);
  
  // Extract additional information from the prompt
  const extractedInfo = extractInfoFromPrompt(prompt);
  console.log(`submitPrompt [${apiCallId}]: Extracted info from prompt:`, extractedInfo);
  
  // Store the original prompt in follow-up conversations so we can use it later
  // This is particularly useful for date-only responses
  let combinedInfo = { ...additionalInfo, ...extractedInfo };
  if (!combinedInfo.originalPrompt && additionalInfo.previousPrompts) {
    // Use the last non-date prompt as the original prompt
    const previousPrompts = JSON.parse(additionalInfo.previousPrompts);
    if (previousPrompts && previousPrompts.length > 0) {
      combinedInfo.originalPrompt = previousPrompts[previousPrompts.length - 1];
    }
  } else if (!combinedInfo.originalPrompt && prompt.split(' ').length > 3) {
    // If this is a full prompt (not just a date), store it for later
    combinedInfo.originalPrompt = prompt;
  }
  
  // Track previous prompts
  if (!combinedInfo.previousPrompts) {
    combinedInfo.previousPrompts = JSON.stringify([prompt]);
  } else {
    try {
      const previousPrompts = JSON.parse(combinedInfo.previousPrompts);
      previousPrompts.push(prompt);
      combinedInfo.previousPrompts = JSON.stringify(previousPrompts);
    } catch (e) {
      combinedInfo.previousPrompts = JSON.stringify([prompt]);
    }
  }
  
  console.log(`submitPrompt [${apiCallId}]: Combined info for API call:`, combinedInfo);
  
  setIsGenerating(true);
  
  // Keep track of whether this request was aborted
  let isAborted = false;
  
  try {
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);
    
    // Add loading message
    const loadingMessageId = `loading-${apiCallId}`;
    setChatMessages(prev => [...prev, { type: 'ai', content: "Generating your event details...", id: loadingMessageId }]);
    
    // Generate the event
    console.log(`submitPrompt [${apiCallId}]: Calling generateEventWithAPI`);
    const response = await generateEventWithAPI(
      prompt,
      modelProvider,
      combinedInfo,
      apiCallId
    ) as GenerateEventResponse;
    
    console.log(`submitPrompt [${apiCallId}]: Received API response:`, JSON.stringify(response, null, 2));
    
    if (isAborted) {
      console.log(`submitPrompt [${apiCallId}]: Request was aborted, ignoring response`);
      return { error: new Error("Request aborted") };
    }
    
    // Remove loading message, looking for it by ID to avoid race conditions
    setChatMessages(prev => {
      // Safely check for message ID - fix for TypeScript error
      return prev.filter(msg => msg.id !== loadingMessageId);
    });
    
    if (response.error) {
      console.error(`submitPrompt [${apiCallId}]: Error in API response:`, response.error);
      throw response.error;
    }
    
    // Process the response and handle missing fields
    console.log(`submitPrompt [${apiCallId}]: Processing API response through processResponse`);
    const processed = processResponse(
      response, 
      setChatMessages, 
      waitingForBudget, 
      requestBudgetInChat, 
      setPreviouslyRequestedFields,
      apiCallId
    );
    
    console.log(`submitPrompt [${apiCallId}]: ProcessResponse result:`, processed);
    
    // If we processed the response successfully
    if (processed) {
      // Update prompt count for non-resubmissions with complete data
      if (!isResubmitting && processed.missing && processed.missing.length === 0) {
        setPromptCount(prev => prev + 1);
      }
      
      return processed;
    }
    
    // If we couldn't process the response, show a generic success message
    console.log(`submitPrompt [${apiCallId}]: Could not process response, showing generic success message`);
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
    console.error(`submitPrompt [${apiCallId}]: Error submitting prompt:`, error);
    
    // Remove loading message if it exists
    setChatMessages(prev => {
      // Safely check for message ID - fix for TypeScript error
      return prev.filter(msg => {
        // Check if the message has an id property before comparing it
        return !(msg.id && msg.id === `loading-${apiCallId}`);
      });
    });
    
    // Add error message to chat
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: createErrorMessage()
    }]);
    
    return { error };
  } finally {
    if (!isAborted) {
      setIsGenerating(false);
    }
  }
  
  // Expose a method to abort this request (for race conditions)
  return {
    abort: () => {
      console.log(`submitPrompt [${apiCallId}]: Aborting request`);
      isAborted = true;
    },
    error: new Error("Request setup failed")
  } as any;
};
