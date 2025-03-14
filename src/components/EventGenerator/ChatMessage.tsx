
import { cn } from "@/lib/utils";
import { Copy, ThumbsDown, ThumbsUp, RotateCcw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
}

export const ChatMessage = ({ message, type, isLoading = false }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
            ? "bg-[#242424] text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
        )}
      >
        <div className="flex items-start gap-3">
          {type === 'ai' ? (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
              <Sparkles size={14} />
            </div>
          ) : (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white shrink-0">
              <User size={14} />
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
              <p className="whitespace-pre-wrap break-words">{message}</p>
            )}
            
            {type === 'ai' && !isLoading && (
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
        </div>
      </div>
    </div>
  );
};
