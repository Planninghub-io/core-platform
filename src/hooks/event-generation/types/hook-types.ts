
import { ChatMessage, GeneratedEvent, MissingInfo } from "../types";

export interface EventGenerationHookReturn {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  showSignUpDialog: boolean;
  setShowSignUpDialog: (show: boolean) => void;
  missingInfo: MissingInfo | null;
  generatedEvent: GeneratedEvent | null;
  isCreating: boolean;
  additionalInfo: Record<string, string>;
  setAdditionalInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  createdEventId: string | null;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  hasMissingDate: boolean;
  hasMissingLocation: boolean;
  handlePromptSubmit: () => void;
  handleCreateEvent: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  missingFields: string[];
  showMissingInfoDialog: boolean;
  setShowMissingInfoDialog: (show: boolean) => void;
  handleAdditionalInfoChange: (field: string, value: string) => void;
  handleMissingInfoSubmit: () => void;
  waitingForBudget: boolean;
  setWaitingForBudget: (waiting: boolean) => void;
}
