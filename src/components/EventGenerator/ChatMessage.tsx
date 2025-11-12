
import { cn } from "@/lib/utils";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from 'dompurify';

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
  isWelcomeMessage?: boolean;
  disableTyping?: boolean;
}

export const ChatMessage = ({ 
  message, 
  type, 
  isLoading = false, 
  isWelcomeMessage = false,
  disableTyping = false
}: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  // Debug log for message rendering
  useEffect(() => {
    console.log(`Rendering message type: ${type}, loading: ${isLoading}, content: ${message.substring(0, 30)}...`);
  }, [message, type, isLoading]);

  // Auto-typing effect for AI messages (if not disabled)
  useEffect(() => {
    if (type === 'ai' && !isLoading && message && message.length > 0) {
      if (disableTyping) {
        // If typing is disabled, show message immediately
        setDisplayedMessage(message);
        setIsTyping(false);
      } else {
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
      }
    } else if (type === 'user') {
      // For user messages, show immediately
      setDisplayedMessage(message);
    }
  }, [message, type, isLoading, disableTyping]);

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
  
  // Process links in the message
  const processMessage = (content: string) => {
    // Enhanced URL regex that matches a wide variety of URL formats including subdomains
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
    
    // Replace URLs with anchor tags that explicitly open in a new tab
    const processedContent = content
      .replace(urlRegex, '<a href="$&" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline" onclick="event.stopPropagation(); window.open(\'$&\', \'_blank\');">$&</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    
    // Sanitize to prevent XSS attacks
    return DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: ['a', 'strong', 'br', 'p', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'onclick']
    });
  };
  
  // ChatGPT style: user messages on right, AI messages on left
  return (
    <div 
      className={cn(
        "w-full mb-6 px-4", 
        type === 'user' ? "flex justify-end" : "flex justify-start",
        isWelcomeMessage && "flex justify-center"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-5 py-4 shadow-sm",
          type === 'user' 
            ? "bg-[#242424] text-white rounded-2xl max-w-[85%]" 
            : "bg-gray-100 text-gray-900 rounded-2xl border border-gray-200 max-w-[85%]",
          isWelcomeMessage && "w-full max-w-full"
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
                  __html: processMessage(disableTyping || type === 'user' ? message : displayedMessage)
                }}
              />
            )}
            
            {type === 'ai' && !isLoading && (!isTyping || disableTyping) && !isWelcomeMessage && (
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
