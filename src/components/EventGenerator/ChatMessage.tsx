
import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'ai';
  isLoading?: boolean;
}

export const ChatMessage = ({ message, type, isLoading = false }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        type === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 shadow-sm",
          type === 'user' 
            ? "bg-[#9b87f5] text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
        )}
      >
        <div className="flex items-start gap-3">
          {type === 'ai' ? (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8b73f4] text-white shrink-0">
              <Sparkles size={14} />
            </div>
          ) : (
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-400 text-white shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
};
