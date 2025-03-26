
import { ChatContainer } from "./chat/ChatContainer";
import { AIModelSelector } from "../components/AIModelSelector";
import { useState, useEffect, useRef } from "react";
import { checkPromptForRequiredFields, trackPendingInformation } from "@/hooks/event-generation/utils/promptPreChecker";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string, id?: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: (prompt: string, modelProvider?: 'openai' | 'anthropic') => void;
  welcomeMessage: string;
  generatedEvent: any | null;
  modelProvider?: 'openai' | 'anthropic';
  onModelChange?: (model: 'openai' | 'anthropic') => void;
  setChatMessages: React.Dispatch<React.SetStateAction<Array<{ type: 'user' | 'ai', content: string, id?: string }>>>;
  setSelectedDate?: (date: string) => void;
  setLocation?: (location: string) => void;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  const [modelProvider, setModelProvider] = useState<'openai' | 'anthropic'>(props.modelProvider || 'openai');
  const lastSubmissionRef = useRef<{ prompt: string, timestamp: number } | null>(null);
  const [pendingInfo, setPendingInfo] = useState<{
    date?: string;
    location?: string;
    description?: string;
    originalPrompt?: string;
  }>({});
  
  // Handle model change
  const handleModelChange = (model: 'openai' | 'anthropic') => {
    console.log("ChatInterface: Model changed from", modelProvider, "to", model);
    setModelProvider(model);
    if (props.onModelChange) {
      props.onModelChange(model);
    }
  };

  // Create a new wrapper for the submit handler to ensure proper logging and debouncing
  const handleSubmit = (userPrompt: string) => {
    console.log("ChatInterface: Submit button clicked with prompt:", userPrompt);
    
    // Check for duplicate submissions
    const now = Date.now();
    if (lastSubmissionRef.current && 
        lastSubmissionRef.current.prompt === userPrompt && 
        now - lastSubmissionRef.current.timestamp < 3000) {
      console.log("ChatInterface: Ignoring duplicate submission within 3 seconds");
      return;
    }
    
    // Add the user message to chat
    props.setChatMessages(prev => [...prev, { type: 'user', content: userPrompt }]);
    
    // If we're in the middle of gathering information for an initial prompt
    if (pendingInfo.originalPrompt) {
      console.log("ChatInterface: Processing follow-up information for original prompt");
      
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
      if (updatedInfo.date && props.setSelectedDate) {
        props.setSelectedDate(updatedInfo.date);
      }
      
      if (updatedInfo.location && props.setLocation) {
        props.setLocation(updatedInfo.location);
      }
      
      // If we now have all required info, proceed with the API call
      if (shouldProceed) {
        console.log("ChatInterface: All required info collected, proceeding with request");
        console.log("ChatInterface: Complete prompt:", completePrompt);
        
        // Call the handler with the complete prompt
        lastSubmissionRef.current = { prompt: completePrompt, timestamp: now };
        props.handlePromptSubmit(completePrompt, modelProvider);
        
        // Clear pending info since we're done collecting
        setPendingInfo({});
        return;
      } else {
        // Still missing info, clear input for user to provide more
        props.setPrompt("");
        return;
      }
    }
    
    // First time prompt submission - check if it has all required fields
    const { shouldProceed, extractedInfo } = checkPromptForRequiredFields(
      userPrompt,
      props.setChatMessages
    );
    
    // If not all required fields are present, store what we have and wait for more info
    if (!shouldProceed) {
      console.log("ChatInterface: Missing required fields in prompt, asking user for more information");
      // Store the original prompt and any extracted info
      setPendingInfo({
        originalPrompt: userPrompt,
        description: userPrompt,
        ...extractedInfo
      });
      
      // Update date and location if extracted
      if (extractedInfo.date && props.setSelectedDate) {
        props.setSelectedDate(extractedInfo.date);
      }
      
      if (extractedInfo.location && props.setLocation) {
        props.setLocation(extractedInfo.location);
      }
      
      props.setPrompt(""); // Clear input for user to add more info
      return;
    }
    
    // If we have all required fields, proceed with the API call
    console.log("ChatInterface: All required fields present, proceeding with API call");
    
    // Update date and location if provided
    if (extractedInfo.date && props.setSelectedDate) {
      props.setSelectedDate(extractedInfo.date);
    }
    
    if (extractedInfo.location && props.setLocation) {
      props.setLocation(extractedInfo.location);
    }
    
    // Update last submission reference
    lastSubmissionRef.current = { prompt: userPrompt, timestamp: now };
    
    if (props.handlePromptSubmit && userPrompt) {
      console.log("ChatInterface: Calling parent handlePromptSubmit with model:", modelProvider);
      // Pass the current userPrompt and modelProvider to the handler
      props.handlePromptSubmit(userPrompt, modelProvider);
    } else {
      console.error("ChatInterface: handlePromptSubmit prop is undefined or prompt is empty");
    }
  };

  useEffect(() => {
    console.log("ChatInterface: Current model provider:", modelProvider);
  }, [modelProvider]);

  return (
    <div className="w-full min-h-[400px] flex flex-col">
      <div className="pb-4">
        <AIModelSelector 
          selectedModel={modelProvider} 
          onChange={handleModelChange} 
        />
      </div>
      <ChatContainer 
        chatMessages={props.chatMessages}
        prompt={props.prompt}
        setPrompt={props.setPrompt}
        isGenerating={props.isGenerating}
        promptCount={props.promptCount}
        handlePromptSubmit={handleSubmit}
        welcomeMessage={props.welcomeMessage}
        generatedEvent={props.generatedEvent}
      />
    </div>
  );
};
