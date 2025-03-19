
import { ChatMessage } from "../../ChatMessage";

interface ChatMessagesProps {
  chatMessages: Array<{ type: 'user' | 'ai', content: string }>;
  isGenerating: boolean;
  welcomeMessage: string;
}

export const ChatMessages = ({ 
  chatMessages, 
  isGenerating, 
  welcomeMessage 
}: ChatMessagesProps) => {
  return (
    <div className="p-4 max-h-[600px] overflow-y-auto">
      {welcomeMessage && (
        <ChatMessage
          key="welcome"
          message={welcomeMessage}
          type="ai"
          isLoading={false}
          isWelcomeMessage={true}
        />
      )}
      
      {chatMessages.map((message, index) => (
        <ChatMessage 
          key={index} 
          message={message.content} 
          type={message.type} 
          isLoading={index === chatMessages.length - 1 && message.type === 'ai' && isGenerating}
        />
      ))}
    </div>
  );
};
