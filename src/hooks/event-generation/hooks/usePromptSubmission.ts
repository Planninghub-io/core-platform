
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

  const handlePromptSubmit = async (prompt: string, modelProvider: 'openai' | 'anthropic' = 'openai') => {
    console.log("usePromptSubmission: handlePromptSubmit called with model:", modelProvider);
    console.log("usePromptSubmission: Prompt received:", prompt);
    
    // Validate the prompt
    if (!prompt || prompt.trim() === "") {
      console.log("usePromptSubmission: Empty prompt, not submitting");
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }
    
    // Handle budget prompt specifically
    if (processBudgetResponse(prompt, waitingForBudget, setAdditionalInfo)) {
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
      // Add user message to chat
      setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);
      
      // Add loading message
      setChatMessages(prev => [...prev, { type: 'ai', content: "Generating your event details..." }]);
      
      // Process the prompt to extract and combine information
      const combinedInfo = processPrompt(prompt, additionalInfo);
      
      console.log("usePromptSubmission: Combined info:", combinedInfo);
      console.log("usePromptSubmission: Using model:", modelProvider);
      
      // Generate the event
      const response = await generateEventWithAPI(
        prompt,
        modelProvider,
        combinedInfo
      );
      
      // Remove loading message
      setChatMessages(prev => {
        const newMessages = [...prev];
        return newMessages.filter((msg, index) => 
          !(index === newMessages.length - 1 && msg.type === 'ai' && msg.content === "Generating your event details...")
        );
      });
      
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
      // Remove loading message if it exists
      setChatMessages(prev => {
        const newMessages = [...prev];
        return newMessages.filter((msg, index) => 
          !(index === newMessages.length - 1 && msg.type === 'ai' && msg.content === "Generating your event details...")
        );
      });
      
      addErrorMessage(setChatMessages, error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to generate event. Please try again.",
        variant: "destructive",
      });
      
      console.error("usePromptSubmission: Error generating event:", error);
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

// Import used by callback function above
import { setShowSignUpDialog } from "./utils/authUtils";
