
import { MissingInfo, GeneratedEvent, ChatMessage } from '../types';

export interface EventGenerationHookState {
  prompt: string;
  isGenerating: boolean;
  promptCount: number;
  showSignUpDialog: boolean;
  missingInfo: MissingInfo | null;
  generatedEvent: GeneratedEvent | null;
  isCreating: boolean;
  additionalInfo: Record<string, string>;
  createdEventId: string | null;
  eventTitle: string;
  selectedDate: string;
  location: string;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  chatMessages: ChatMessage[];
  missingFields: string[];
}

export interface EventGenerationHookActions {
  setPrompt: (prompt: string) => void;
  setShowSignUpDialog: (show: boolean) => void;
  setAdditionalInfo: (info: Record<string, string>) => void; 
  setEventTitle: (title: string) => void;
  setSelectedDate: (date: string) => void;
  setLocation: (location: string) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handlePromptSubmit: () => Promise<void>;
  handleCreateEvent: () => Promise<void>;
}

export type EventGenerationHookReturn = EventGenerationHookState & EventGenerationHookActions;
