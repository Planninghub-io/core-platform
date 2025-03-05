
export interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  estimatedPrice: string;
  imagePrompt: string;
}

export interface MissingInfo {
  needsInfo: true;
  missingFields: string[];
  message: string;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

export interface EventGenerationState {
  prompt: string;
  isGenerating: boolean;
  promptCount: number;
  showSignUpDialog: boolean;
  showMissingInfoDialog: boolean;
  missingInfo: MissingInfo | null;
  generatedEvent: GeneratedEvent | null;
  additionalInfo: Record<string, string>;
  isResubmitting: boolean;
  eventTitle: string;
  selectedDate: string;
  location: string;
  chatMessages: ChatMessage[];
  missingFields: string[];
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
}
