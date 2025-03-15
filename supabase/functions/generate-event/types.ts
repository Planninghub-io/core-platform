
// Define the structure of event data
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

// Define the structure of missing information response
export interface MissingInfoResponse {
  needsInfo: true;
  missingFields: string[];
  message: string;
}
