
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";
import { submitPrompt } from "./services/promptSubmissionService";
import { SubmissionResult, GeneratedEvent } from "../types/api-types";

// Define a more explicit result type to fix TypeScript errors
interface ApiResponse {
  validatedEvent?: GeneratedEvent;
  missing?: string[];
  needsBudget?: boolean;
  error?: Error;
}

/**
 * Hook for handling prompt submission and processing
 */
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
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [previouslyRequestedFields, setPreviouslyRequestedFields] = useState<string[]>([]);
  const [lastApiCallId, setLastApiCallId] = useState<string | null>(null);

  /**
   * Handle prompt submission
   */
  const handlePromptSubmit = async (prompt: string, modelProvider: 'openai' | 'anthropic' = 'openai') => {
    console.log("usePromptSubmission: handlePromptSubmit called with model:", modelProvider);
    console.log("usePromptSubmission: Prompt received:", prompt);
    
    if (isGenerating) {
      console.log("usePromptSubmission: Already generating, ignoring new request");
      return;
    }
    
    // Generate a unique ID for this API call
    const apiCallId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`usePromptSubmission: Starting API call with ID: ${apiCallId}`);
    setLastApiCallId(apiCallId);
    
    try {
      const result = await submitPrompt(
        prompt,
        modelProvider,
        additionalInfo,
        setChatMessages,
        setIsGenerating,
        waitingForBudget,
        requestBudgetInChat,
        setPreviouslyRequestedFields,
        setPromptCount,
        isResubmitting,
        apiCallId
      );
      
      console.log(`usePromptSubmission [${apiCallId}]: Result from submitPrompt:`, JSON.stringify(result, null, 2));
      
      // Ensure this is still the most recent API call
      if (lastApiCallId !== apiCallId) {
        console.log(`usePromptSubmission [${apiCallId}]: Ignoring result as a newer API call was made`);
        return;
      }
      
      if (result?.error) {
        console.error(`usePromptSubmission [${apiCallId}]: Error in result:`, result.error);
        toast({
          title: "Error",
          description: result.error.message || "Failed to generate event. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update generated event if we have one
      if (result?.validatedEvent) {
        console.log(`usePromptSubmission [${apiCallId}]: Setting generated event:`, result.validatedEvent);
        setGeneratedEvent(result.validatedEvent);
      } else {
        console.log(`usePromptSubmission [${apiCallId}]: No validated event in result`);
      }
      
      // Update missing fields if any
      if (result?.missing) {
        console.log(`usePromptSubmission [${apiCallId}]: Setting missing fields:`, result.missing);
        setMissingFields(result.missing);
      } else {
        console.log(`usePromptSubmission [${apiCallId}]: No missing fields in result`);
      }
      
    } catch (error: any) {
      console.error(`usePromptSubmission [${apiCallId}]: Error in handlePromptSubmit:`, error);
      
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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
