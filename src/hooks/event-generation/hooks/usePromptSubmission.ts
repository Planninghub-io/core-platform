
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";
import { submitPrompt } from "./services/promptSubmissionService";
import { SubmissionResult, GeneratedEvent } from "../types/api-types";

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

  /**
   * Handle prompt submission
   */
  const handlePromptSubmit = async (prompt: string, modelProvider: 'openai' | 'anthropic' = 'openai') => {
    console.log("usePromptSubmission: handlePromptSubmit called with model:", modelProvider);
    console.log("usePromptSubmission: Prompt received:", prompt);
    
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
        isResubmitting
      );
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to generate event. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update generated event if we have one
      if (result.validatedEvent) {
        setGeneratedEvent(result.validatedEvent);
      }
      
      // Update missing fields if any
      if (result.missing) {
        setMissingFields(result.missing);
      }
      
    } catch (error: any) {
      console.error("usePromptSubmission: Error in handlePromptSubmit:", error);
      
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
