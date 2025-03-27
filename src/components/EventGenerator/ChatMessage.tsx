
import { cn } from "@/lib/utils";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
  isWelcomeMessage?: boolean;
}

export const ChatMessage = ({ message, type, isLoading = false, isWelcomeMessage = false }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  // Debug log for message rendering
  useEffect(() => {
    console.log(`Rendering message type: ${type}, loading: ${isLoading}, content: ${message.substring(0, 30)}...`);
  }, [message, type, isLoading]);

  // Auto-typing effect for AI messages
  useEffect(() => {
    if (type === 'ai' && !isLoading && message && message.length > 0) {
      // Start typing animation for AI messages
      setIsTyping(true);
      setDisplayedMessage('');
      
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < message.length) {
          setDisplayedMessage(prev => prev + message.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20); // Adjust typing speed here
      
      return () => clearInterval(typingInterval);
    } else if (type === 'user') {
      // For user messages, show immediately
      setDisplayedMessage(message);
    }
  }, [message, type, isLoading]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      description: "Message copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    toast({
      description: "Thank you for your feedback!",
    });
  };

  const handleThumbsDown = () => {
    toast({
      description: "We'll work on improving our responses.",
    });
  };

  const handleRegenerate = () => {
    toast({
      description: "Regenerating response...",
    });
  };
  
  // ChatGPT style: user messages on right, AI messages on left
  return (
    <div 
      className={cn(
        "w-full mb-6 px-4", // Added px-4 to ensure full message visibility
        type === 'user' ? "flex justify-end" : "flex justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-5 py-4 shadow-sm",
          type === 'user' 
            ? "bg-[#242424] text-white rounded-2xl" 
            : "bg-gray-100 text-gray-900 rounded-2xl border border-gray-200"
        )}
      >
        <div className="flex items-start gap-3">
          {type === 'ai' && (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
              <Sparkles size={14} />
            </div>
          )}
          
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words" 
                dangerouslySetInnerHTML={{ 
                  __html: (type === 'ai' ? displayedMessage : message)
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />') 
                }}
              />
            )}
            
            {type === 'ai' && !isLoading && !isTyping && !isWelcomeMessage && (
              <div className="mt-3 flex items-center gap-1 text-gray-500">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-200"
                  onClick={copyToClipboard}
                >
                  <Copy size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-200"
                  onClick={handleThumbsUp}
                >
                  <ThumbsUp size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-200"
                  onClick={handleThumbsDown}
                >
                  <ThumbsDown size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-200"
                  onClick={handleRegenerate}
                >
                  <RotateCcw size={14} />
                </Button>
              </div>
            )}
          </div>
          
          {type === 'user' && (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white shrink-0">
              <User size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
