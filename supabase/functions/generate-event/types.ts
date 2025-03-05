
// Type definitions for the generate-event function

export interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface MissingInfoResponse {
  needsInfo: true;
  missingFields: string[];
  message: string;
}

export interface EventResponse extends Partial<EventData> {
  imageUrl?: string | null;
}

export interface ErrorResponse {
  error: string;
}
