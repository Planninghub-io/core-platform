
/**
 * API response types for event generation
 */

export interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt?: string;
  imageUrl?: string;
  missingFields?: string[];
}

export interface GenerateEventResponse {
  data?: GeneratedEvent; // Make data optional
  missing?: string[];
  error?: Error;
}

export interface SubmissionResult {
  validatedEvent?: GeneratedEvent;
  missing?: string[];
  needsBudget?: boolean;
  error?: Error;
}
