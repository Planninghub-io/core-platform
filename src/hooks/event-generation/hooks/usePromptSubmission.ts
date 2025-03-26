
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";
import { addErrorMessage } from "./utils/chatMessageUtils";
import { processPrompt } from "./utils/promptProcessor";
import { processBudgetResponse } from "./services/budgetService";
import { verifyAuthentication } from "./services/authService";
import { generateEventWithAPI } from "./services/eventGenerationAPI";
import { processSuccessfulResponse } from "./services/responseProcessingService";

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
    if (processBudgetResponse(userPrompt, waitingForBudget, setAdditionalInfo)) {
      return;
    }

    // Check authentication
    const isAuthenticated = await verifyAuthentication(
      promptCount, 
      isResubmitting, 
      setShowSignUpDialog
    );
    
    if (!isAuthenticated) return;
    
    setIsGenerating(true);
    
    try {
      // Process the prompt to extract and combine information
      const combinedInfo = processPrompt(userPrompt, additionalInfo);
      
      // Generate the event
      const response = await generateEventWithAPI(
        userPrompt,
        modelProvider,
        combinedInfo
      );
      
      if (response.error) {
        throw response.error;
      }
      
      // Process successful response
      processSuccessfulResponse(
        response, 
        setChatMessages, 
        setGeneratedEvent, 
        setPromptCount, 
        isResubmitting
      );
      
    } catch (error: any) {
      addErrorMessage(setChatMessages, error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
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

// Fix for TypeScript error with accessing chat messages
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

// Import used by callback function above
import { setShowSignUpDialog } from "./utils/authUtils";
