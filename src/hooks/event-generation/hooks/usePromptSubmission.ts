
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";
import { generateEventWithAPI } from "./services/eventGenerationAPI";

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

  // Process response from AI model and check for missing fields
  const processResponse = (response: any) => {
    if (response && response.data) {
      // Extract all missing fields based on response
      const missing = response.missing || [];
      console.log("Missing fields:", missing);
      
      // Set missing fields state for UI to request them
      setMissingFields(missing);
      
      // Store the generated event data regardless of missing fields
      setGeneratedEvent(response.data);
      
      // Update the prompt count for a new prompt
      if (!isResubmitting) {
        setPromptCount(prev => prev + 1);
      }
      
      // Different handling based on what's missing
      if (missing.includes('budget') && !waitingForBudget) {
        // Request budget in chat
        requestBudgetInChat();
        return true;
      }
      
      if (missing.length > 0) {
        // Generate AI message asking for the missing information
        let missingFieldMessage = "I need a bit more information to create your event. Could you please provide: ";
        
        const fieldLabels = {
          'date': 'event date and time',
          'location': 'event location',
          'budget': 'estimated budget',
          'attendees': 'expected number of attendees'
        };
        
        const formattedFields = missing.map(field => 
          fieldLabels[field as keyof typeof fieldLabels] || field
        ).join(', ');
        
        missingFieldMessage += formattedFields + "?";
        
        // Add the message to chat
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: missingFieldMessage
        }]);
        
        return true;
      }
      
      // If we have a complete event
      if (missing.length === 0) {
        // Success message
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: `Great! I've generated your event: "${response.data.title}". Please review the details below.`
        }]);
        
        return true;
      }
    }
    
    return false;
  };

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
    
    // Extract information from the prompt to add to additionalInfo
    const combinedInfo: Record<string, string> = { ...additionalInfo };
    
    // Check for key information in the prompt
    if (prompt.toLowerCase().includes("attendees") || prompt.toLowerCase().includes("guests")) {
      const attendeesMatch = prompt.match(/(\d+)\s*(attendees|guests|people)/i);
      if (attendeesMatch) {
        combinedInfo.attendees = attendeesMatch[1];
      }
    }
    
    if (prompt.toLowerCase().includes("budget") || prompt.toLowerCase().includes("cost")) {
      const budgetMatch = prompt.match(/\$?(\d+)(?:,\d+)?(?:\.\d+)?\s*(budget|cost)/i);
      if (budgetMatch) {
        combinedInfo.budget = budgetMatch[1];
      }
    }
    
    if (prompt.toLowerCase().includes("location") || prompt.toLowerCase().includes("place")) {
      const locationMatch = prompt.match(/(?:location|place|at|in)\s*:\s*([^,\.]+)/i);
      if (locationMatch) {
        combinedInfo.location = locationMatch[1].trim();
      }
    }
    
    setIsGenerating(true);
    
    try {
      // Add user message to chat
      setChatMessages(prev => [...prev, { type: 'user', content: prompt }]);
      
      // Add loading message
      setChatMessages(prev => [...prev, { type: 'ai', content: "Generating your event details..." }]);
      
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
      
      // Process the response and handle missing fields
      const processed = processResponse(response);
      
      if (!processed) {
        // If we couldn't process the response, show a generic success message
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: "I've generated an event based on your request. Please review the details."
        }]);
      }
      
    } catch (error: any) {
      // Remove loading message if it exists
      setChatMessages(prev => {
        const newMessages = [...prev];
        return newMessages.filter((msg, index) => 
          !(index === newMessages.length - 1 && msg.type === 'ai' && msg.content === "Generating your event details...")
        );
      });
      
      // Add error message to chat
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: "I'm sorry, I encountered an error while generating your event. Please try again with more details."
      }]);
      
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
