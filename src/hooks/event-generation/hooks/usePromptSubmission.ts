
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";
import { checkAuthentication, setShowSignUpDialog } from "./utils/authUtils";
import { processPrompt } from "./utils/promptProcessor";
import { generateEventAPI } from "./services/eventGenerationService";

export const usePromptSubmission = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [missingInfo, setMissingInfo] = useState<any>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState<any>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);

  const handlePromptSubmit = async (modelProvider: 'openai' | 'anthropic' = 'openai') => {
    console.log("usePromptSubmission: handlePromptSubmit called with model:", modelProvider);
    
    // Get the current prompt from the most recent user message
    let userPrompt = findLastUserMessage(setChatMessages);
    
    if (userPrompt === "") {
      console.log("usePromptSubmission: Empty prompt, not submitting");
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }
    
    // Handle budget prompt specifically
    if (handleBudgetPrompt(userPrompt, waitingForBudget, setAdditionalInfo)) {
      return;
    }

    // Check authentication
    const isAuthenticated = await checkAuthentication(promptCount, isResubmitting, setShowSignUpDialog);
    if (!isAuthenticated) return;
    
    setIsGenerating(true);
    
    try {
      // Generate the event
      await generateEvent(
        userPrompt, 
        modelProvider, 
        additionalInfo, 
        setChatMessages, 
        setGeneratedEvent, 
        setPromptCount, 
        isResubmitting
      );
    } catch (error: any) {
      handleError(error, setChatMessages, toast);
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
    missingFields,
    previouslyRequestedFields,
    handlePromptSubmit
  };
};

// Find the most recent user message
const findLastUserMessage = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
): string => {
  let userPrompt = "";
  setChatMessages((prev) => {
    const messages = [...prev];
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        userPrompt = messages[i].content;
        break;
      }
    }
    return messages; // Return unchanged, just using for inspection
  });
  
  console.log("usePromptSubmission: User prompt from chat:", userPrompt);
  return userPrompt;
};

// Handle budget prompt specifically
const handleBudgetPrompt = (
  userPrompt: string,
  waitingForBudget: boolean,
  setAdditionalInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>
): boolean => {
  if (waitingForBudget) {
    console.log("usePromptSubmission: Processing budget response");
    // Add the extracted budget to additionalInfo
    const extractedBudget = extractBudgetFromPrompt(userPrompt) || userPrompt;
    setAdditionalInfo(prev => ({
      ...prev,
      budget: extractedBudget
    }));
    
    // Return true to indicate we handled the budget prompt
    return true;
  }
  
  return false;
};

// Generate the event using the API
const generateEvent = async (
  userPrompt: string,
  modelProvider: 'openai' | 'anthropic',
  additionalInfo: Record<string, string>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setGeneratedEvent: React.Dispatch<React.SetStateAction<any>>,
  setPromptCount: React.Dispatch<React.SetStateAction<number>>,
  isResubmitting: boolean
) => {
  console.log(`usePromptSubmission: Generating event with model: ${modelProvider}`);
  
  // Process the prompt to extract and combine information
  const combinedInfo = processPrompt(userPrompt, additionalInfo);
  
  // Add model provider to the additional info
  combinedInfo.modelProvider = modelProvider;
  
  console.log("usePromptSubmission: Combined info for API call:", combinedInfo);
  
  // Generate the event
  const response = await generateEventAPI({
    prompt: userPrompt,
    additionalInfo: combinedInfo,
    modelProvider
  });
  
  if (response.error) {
    throw response.error;
  }
  
  // Add AI response to chat messages
  setChatMessages(prev => [
    ...prev,
    { 
      type: 'ai', 
      content: `I've generated an event plan based on your request. Please review the details below.` 
    }
  ]);
  
  console.log("usePromptSubmission: API response:", response);
  
  // Process the event response
  if (response.data) {
    // Store generated event
    setGeneratedEvent(response.data);
    
    // Update prompt count for new prompts
    if (!isResubmitting) {
      setPromptCount(prev => prev + 1);
    }
  }
};

// Handle errors during event generation
const handleError = (
  error: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  toast: any
) => {
  console.error('Error generating event:', error);
  
  // Add error message to chat
  setChatMessages(prev => [...prev, {
    type: 'ai',
    content: "I'm sorry, I encountered an error while generating your event. Please try again with a more detailed prompt."
  }]);
  
  toast({
    title: "Error",
    description: error.message || "Failed to generate event. Please try again.",
    variant: "destructive",
  });
};

// Import these from other files for this file to work correctly
import { extractBudgetFromPrompt } from "../utils/prompt-extraction";
