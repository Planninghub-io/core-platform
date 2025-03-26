
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../types";
import { 
  extractDateFromPrompt,
  extractLocationFromPrompt,
  extractBudgetFromPrompt
} from "../utils/prompt-extraction";

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
    let userPrompt = "";
    // Check if we have user messages in the chat already
    const userMessages = setChatMessages((prev) => {
      const messages = [...prev];
      // Find the most recent user message if available
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type === 'user') {
          userPrompt = messages[i].content;
          break;
        }
      }
      return messages; // Return unchanged, just using for inspection
    });
    
    console.log("usePromptSubmission: User prompt from chat:", userPrompt);
    
    // If we're waiting for budget specifically, any new prompt is considered the budget
    if (waitingForBudget) {
      console.log("usePromptSubmission: Processing budget response");
      // Add the extracted budget to additionalInfo
      const extractedBudget = extractBudgetFromPrompt(userPrompt) || userPrompt;
      setAdditionalInfo(prev => ({
        ...prev,
        budget: extractedBudget
      }));
      
      // Clear the waiting flag
      return;
    }
    
    if (!userPrompt.trim()) {
      console.log("usePromptSubmission: Empty prompt, not submitting");
      toast({
        title: "Error",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    // Check authentication for non-first prompts
    if (promptCount >= 1 && !isResubmitting) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setShowSignUpDialog(true);
        return;
      }
    }
    
    setIsGenerating(true);
    
    try {
      console.log(`usePromptSubmission: Generating event with model: ${modelProvider}`);
      
      // Extract information from the prompt
      const extractedDate = extractDateFromPrompt(userPrompt);
      const extractedLocation = extractLocationFromPrompt(userPrompt);
      const extractedBudget = extractBudgetFromPrompt(userPrompt);
      
      // Prepare additional info
      const combinedInfo: Record<string, string> = { ...additionalInfo };
      
      if (extractedDate) {
        combinedInfo.date = extractedDate;
      }
      
      if (extractedLocation) {
        combinedInfo.location = extractedLocation;
      }
      
      if (extractedBudget) {
        combinedInfo.budget = extractedBudget;
      }
      
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
    } catch (error: any) {
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

// Helper function for showing sign up dialog
const setShowSignUpDialog = (show: boolean) => {
  // Implementation would go here in a real component
  console.log("Would show sign up dialog:", show);
};

// Mock implementation of generateEventAPI for testing
const generateEventAPI = async ({
  prompt,
  additionalInfo = {},
  modelProvider = 'openai'
}: {
  prompt: string;
  additionalInfo?: Record<string, string>;
  modelProvider?: 'openai' | 'anthropic';
}) => {
  try {
    console.log('Sending prompt to generate event:', prompt);
    console.log('Using model provider:', modelProvider);
    
    // Call the actual API
    const { data, error } = await supabase.functions.invoke('generate-event', {
      body: { 
        prompt,
        modelProvider,
        additionalInfo
      },
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Received response from generate-event:', data);
    return { data };
  } catch (error: any) {
    console.error('Error generating event:', error);
    return { error };
  }
};
