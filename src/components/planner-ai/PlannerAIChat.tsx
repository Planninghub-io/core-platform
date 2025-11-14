import React, { useState, useRef, useEffect } from 'react';
import { usePlannerAI } from '@/hooks/usePlannerAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Trash2 } from 'lucide-react';

interface PlannerAIChatProps {
  eventContext?: {
    title?: string;
    date?: string;
    end_date?: string;
    description?: string;
    location?: string;
    category?: string;
    expected_attendees?: string | number;
  };
}

export const PlannerAIChat: React.FC<PlannerAIChatProps> = ({ eventContext }) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    error,
    functionCalls,
    sendMessage,
    clearConversation
  } = usePlannerAI(eventContext);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[600px] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Planner AI</h3>
          <p className="text-sm text-muted-foreground">
            Your intelligent event planning assistant
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearConversation}
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2">
                {error}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about event planning..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {functionCalls.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Used {functionCalls.length} function{functionCalls.length > 1 ? 's' : ''} to help you
          </div>
        )}
      </form>
    </Card>
  );
};



