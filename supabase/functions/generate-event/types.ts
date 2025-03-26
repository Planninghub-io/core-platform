
// Common types for the generate-event function

export interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt?: string;
  imageUrl?: string;
  attendees?: string;
}

export interface EventResponse {
  [key: string]: any;
}

export interface ErrorResponse {
  error: string;
}
