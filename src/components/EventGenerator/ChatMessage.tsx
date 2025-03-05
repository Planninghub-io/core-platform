
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
}

export const ChatMessage = ({ message, type, isLoading = false }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex w-full",
        type === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          type === 'user' 
            ? "bg-[#9b87f5] text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-900 rounded-tl-none"
        )}
      >
        <div className="flex items-start gap-2">
          {type === 'ai' && (
            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b73f4] text-white">
              <Sparkles size={12} />
            </div>
          )}
          <div>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
