
import { ChatMessage } from "../types";

export const formatMissingFieldsMessage = (missing: string[]): string => {
  const missingFieldsFormatted = missing.map(field => {
    if (field === 'date') return 'start date and time';
    if (field === 'budget') return 'estimated budget';
    return field;
  }).join(' and ');
  
  return `I need a bit more information to create your event. Could you please provide the ${missingFieldsFormatted}?`;
};

export const createSuccessMessage = (eventTitle: string): string => {
  return `Great! I've generated an event based on your request: "${eventTitle}". Please review the details below and click "Create This Event" if everything looks good.`;
};

export const createMissingInfoMessage = (missingFields: string[]): string => {
  const missingFieldsFormatted = missingFields.map(field => {
    if (field === 'date') return 'start date and time';
    if (field === 'budget') return 'estimated budget';
    return field;
  }).join(', ');
  
  return `I'd be happy to help plan your event, but I need a few more details: ${missingFieldsFormatted}. Could you please provide these details in your next message?`;
};

export const createBudgetRequestMessage = (): string => {
  return `What's your estimated budget for this event? You can provide an amount like "$500" or just tell me if it's a free event.`;
};

export const createErrorMessage = (): string => {
  return `I'm sorry, I encountered an error while generating your event. Please try again with a more detailed prompt.`;
};
