
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GeneratedEvent, MissingInfo } from "./types";

export const useGenerateEventAI = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [missingInfo, setMissingInfo] = useState<MissingInfo | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const generateEvent = async (prompt: string, providedInfo: Record<string, string> = {}) => {
    setIsGenerating(true);
    
    try {
      // Combine the existing additional info with provided info
      const combinedInfo = { ...additionalInfo, ...providedInfo };
      
      let fullPrompt = prompt;
      if (Object.keys(combinedInfo).length > 0) {
        const additionalDetails = Object.entries(combinedInfo)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        fullPrompt = `${prompt}. Additional details: ${additionalDetails}`;
      }

      console.log('Sending prompt to generate event:', fullPrompt);

      const { data, error } = await supabase.functions.invoke('generate-event', {
        body: { 
          prompt: fullPrompt,
          additionalInfo: combinedInfo
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Received response from generate-event:', data);

      // If we received a proper event response
      if (data && (data.title || data.description || data.location)) {
        // Create event object, allowing for missing fields
        const validatedEvent: GeneratedEvent = {
          title: data.title?.trim() || 'Enter Event Name',
          description: data.description || '',
          date: providedInfo.date || data.date || '',
          location: providedInfo.location || data.location || '',
          category: data.category || 'Other',
          estimatedPrice: data.estimatedPrice || 'Free',
          imagePrompt: data.imagePrompt || 'event',
        };

        // Check for missing critical fields
        const missing: string[] = [];
        if (!validatedEvent.date) missing.push('date');
        if (!validatedEvent.location) missing.push('location');
        
        setMissingFields(missing);

        console.log('Created validated event:', validatedEvent);
        setGeneratedEvent(validatedEvent);
        setMissingInfo(null);
        setAdditionalInfo({});
        setIsResubmitting(false);
        
        if (!isResubmitting) {
          setPromptCount(prev => prev + 1);
        }
        
        // Add success message to chat
        let responseMessage = `Great! I've generated an event based on your request: "${validatedEvent.title}". Check out the details below.`;
        
        // Add message about missing information if needed
        if (missing.length > 0) {
          const missingFieldsFormatted = missing.map(field => {
            if (field === 'date') return 'start date and time';
            return field;
          }).join(' and ');
          
          responseMessage += ` Please provide the missing ${missingFieldsFormatted} below.`;
        }
        
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: responseMessage
        }]);
        
        return { validatedEvent, error: null };
      } 
      // Handle missing info response
      else if (data && data.needsInfo === true) {
        if (!isResubmitting) {
          const prePopulatedInfo: Record<string, string> = {};
          
          const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
          const dateTimeMatch = prompt.match(dateTimeRegex);
          
          const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
          const locationMatch = prompt.match(locationRegex);

          if (dateTimeMatch && data.missingFields.includes('date')) {
            prePopulatedInfo.date = dateTimeMatch[1];
          }
          
          if (locationMatch && (data.missingFields.includes('location') || data.missingFields.includes('city'))) {
            const locationField = data.missingFields.includes('location') ? 'location' : 'city';
            prePopulatedInfo[locationField] = locationMatch[1];
          }

          setAdditionalInfo(prePopulatedInfo);
          setMissingInfo(data);
          setIsResubmitting(true);
          setMissingFields(data.missingFields || []);
          
          // Format missing fields for display
          const missingFieldsFormatted = data.missingFields.map(field => {
            if (field === 'date') return 'start date and time';
            return field;
          }).join(', ');
          
          // Add AI message to chat
          const aiMessage = `I'd be happy to help plan your event, but I need a few more details: ${missingFieldsFormatted}. Could you please provide these details in your next message?`;
          setChatMessages(prev => [...prev, {type: 'ai', content: aiMessage}]);
          
          return { needsMoreInfo: true, data };
        }
      } else {
        // No valid data received
        throw new Error('Invalid response from event generation');
      }

      // If execution reaches here, handle as error
      throw new Error('Failed to generate event details');

    } catch (error: any) {
      console.error('Error generating event:', error);
      
      // Add error message to chat
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: `I'm sorry, I encountered an error while generating your event. Please try again with a more detailed prompt.`
      }]);
      
      return { error };
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
    generateEvent,
    chatMessages,
    setChatMessages,
    missingFields
  };
};
