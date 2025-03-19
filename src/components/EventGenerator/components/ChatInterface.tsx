
import { ChatContainer } from "./chat/ChatContainer";

interface ChatInterfaceProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  promptCount: number;
  handlePromptSubmit: () => void;
  welcomeMessage: string;
  generatedEvent: any | null;
}

export const ChatInterface = (props: ChatInterfaceProps) => {
  return <ChatContainer {...props} />;
};
