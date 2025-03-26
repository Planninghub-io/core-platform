
import { ChatMessage } from "../../types";

/**
 * Process API response, extracting missing fields and generating user-friendly messages
 */
export const processResponse = (
  response: any,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  waitingForBudget: boolean,
  requestBudgetInChat: () => void,
  setPreviouslyRequestedFields: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (response && response.data) {
    // Extract all missing fields based on response
    const missing = response.missing || [];
    console.log("Missing fields:", missing);
    
    // Check if we're missing budget specifically
    if (missing.includes('budget') && !waitingForBudget) {
      requestBudgetInChat();
      return { needsBudget: true, validatedEvent: response.data, missing };
    }
    
    // If we have missing fields, ask the user for them
    if (missing.length > 0) {
      // Update previously requested fields to track what we're asking for
      setPreviouslyRequestedFields(missing);
      
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
      
      return { validatedEvent: response.data, missing, error: null };
    }
    
    // If we have a complete event with no missing fields
    if (missing.length === 0) {
      // Success message
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: `Great! I've generated your event: "${response.data.title}". Please review the details below.`
      }]);
      
      return { validatedEvent: response.data, missing: [], error: null };
    }
  }
  
  return false;
};
