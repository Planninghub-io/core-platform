
import { cn } from "@/lib/utils";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
  isWelcomeMessage?: boolean;
}

export const ChatMessage = ({ message, type, isLoading = false, isWelcomeMessage = false }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messageRef = useRef<string>(message);
  const typingIntervalRef = useRef<number | null>(null);
  const typingIndexRef = useRef(0);
  
  // Debug log for message rendering
  useEffect(() => {
    console.log(`Rendering message type: ${type}, loading: ${isLoading}, content: ${message.substring(0, 30)}...`);
  }, [message, type, isLoading]);

  // Effect for auto-typing animation
  useEffect(() => {
    // Skip typing animation for user messages or when loading
    if (type === 'user' || isLoading || isWelcomeMessage) {
      setDisplayedMessage(message);
      return;
    }

    // If the message changes, reset the animation
    if (messageRef.current !== message) {
      messageRef.current = message;
      typingIndexRef.current = 0;
      setDisplayedMessage("");
      
      // Clear any existing interval
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
      }
      
      // Start typing animation if we have a message to type
      if (message) {
        setIsTyping(true);
        const speed = 15; // characters per interval (adjust for faster/slower typing)
        
        typingIntervalRef.current = window.setInterval(() => {
          if (typingIndexRef.current < message.length) {
            const nextChunk = message.substring(
              typingIndexRef.current, 
              Math.min(typingIndexRef.current + speed, message.length)
            );
            setDisplayedMessage(prev => prev + nextChunk);
            typingIndexRef.current += speed;
          } else {
            // Done typing
            setIsTyping(false);
            if (typingIntervalRef.current) {
              window.clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
            }
          }
        }, 50);
      }
    }
    
    // Cleanup interval on unmount
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
      }
    };
  }, [message, type, isLoading, isWelcomeMessage]);

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
        "w-full mb-6",
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
                  __html: (type === 'ai' && !isWelcomeMessage ? displayedMessage : message)
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

