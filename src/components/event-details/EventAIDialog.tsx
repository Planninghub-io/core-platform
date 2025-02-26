
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventAIDialogProps {
  event: {
    title: string;
    date: string;
    end_date: string;
    description: string | null;
    location: string | null;
    category: string | null;
    expected_attendees: number | null;
  };
}

export const EventAIDialog = ({ event }: EventAIDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!userQuestion.trim()) {
      toast({
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('event-ai-assistant', {
        body: {
          question: userQuestion,
          eventContext: {
            title: event.title,
            date: event.date,
            end_date: event.end_date,
            description: event.description,
            location: event.location,
            category: event.category,
            expected_attendees: event.expected_attendees,
          },
        },
      });

      if (error) throw error;
      setResponse(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ask about {event.title}</DialogTitle>
          <DialogDescription>
            Ask any questions about this event and I'll help you find the answers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What would you like to know about this event?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={loading}
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? 'Getting answer...' : 'Ask Question'}
            </Button>
          </div>
          
          {response && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
