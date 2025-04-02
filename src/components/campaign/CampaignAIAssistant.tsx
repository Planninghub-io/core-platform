
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { X, Send, CalendarPlus, MessageSquare, Settings, Ticket, Link as LinkIcon, Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CampaignAIAssistantProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeneratedEvent {
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
}

export const CampaignAIAssistant = ({ onClose }: CampaignAIAssistantProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you plan campaign events. Tell me what kind of event you want to organize, or just provide a brief description and I can help you flesh out the details.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'openai' | 'anthropic'>('openai');
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Call the AI assistant edge function
      const { data, error } = await supabase.functions.invoke('event-ai-assistant', {
        body: { 
          question: userMessage,
          eventContext: generatedEvent || {
            title: '',
            date: '',
            end_date: '',
            description: '',
            location: '',
            category: '',
            expected_attendees: ''
          },
          modelProvider: selectedModel
        }
      });
      
      if (error) throw error;
      
      // Add the response to the messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Try to extract event details from the conversation
      if (!generatedEvent) {
        const eventDetails = extractEventDetails([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.response }]);
        if (eventDetails) {
          setGeneratedEvent(eventDetails);
          setActiveTab('preview');
        }
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple function to extract event details from conversation
  const extractEventDetails = (messages: Message[]): GeneratedEvent | null => {
    let title = '';
    let description = '';
    let date = '';
    let location = '';
    let type = '';
    
    const fullText = messages.map(m => m.content).join(' ');
    
    // Very basic extraction - in a real application this would be more sophisticated
    const titleMatch = fullText.match(/title:?\s*["']?([^"'\n]+)["']?/i);
    const descMatch = fullText.match(/description:?\s*["']?([^"'\n]+(.+?))["']?(?=\s*location|\s*date|\s*type|$)/is);
    const dateMatch = fullText.match(/date:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/on:?\s*["']?([^"'\n]+)["']?/i);
    const locationMatch = fullText.match(/location:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/at:?\s*["']?([^"'\n]+)["']?/i);
    const typeMatch = fullText.match(/type:?\s*["']?([^"'\n]+)["']?/i) || fullText.match(/event type:?\s*["']?([^"'\n]+)["']?/i);
    
    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
    if (dateMatch) date = dateMatch[1].trim();
    if (locationMatch) location = locationMatch[1].trim();
    if (typeMatch) type = typeMatch[1].trim();
    
    // Only return if we have at least a title and one other piece of information
    if (title && (description || date || location || type)) {
      return { title, description, date, location, type };
    }
    
    return null;
  };

  const createEvent = () => {
    if (!generatedEvent) return;
    
    setIsCreating(true);
    
    // Simulate event creation process
    setTimeout(() => {
      toast.success('Event created successfully!', {
        description: `"${generatedEvent.title}" has been added to your events.`,
        action: {
          label: 'View',
          onClick: () => navigate('/events-hub')
        }
      });
      setIsCreating(false);
      onClose();
    }, 1500);
  };

  const suggestedPrompts = [
    "Help me create a town hall event for my campaign",
    "I need to organize a fundraising dinner next month",
    "Plan a volunteer training session for my campaign staff",
    "Create a virtual phone banking event"
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] sm:h-[650px] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Campaign AI Assistant</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Create campaign events with AI assistance from OpenAI or Claude
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 px-6 pb-2">
          <Select value={selectedModel} onValueChange={(value: 'openai' | 'anthropic') => setSelectedModel(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
              <SelectItem value="anthropic">Anthropic Claude</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedEvent}>Event Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-6 pt-2 h-full overflow-hidden flex flex-col">
          <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`px-4 py-2 rounded-lg max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-lg max-w-[80%] bg-muted text-foreground">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {suggestedPrompts.map((prompt, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start text-sm p-3 h-auto"
                    onClick={() => {
                      setMessage(prompt);
                      setTimeout(handleSendMessage, 100);
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the event you want to create..."
                className="min-h-[60px] resize-none flex-1"
              />
              <Button 
                className="self-end"
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 overflow-y-auto space-y-4 mt-0">
            {generatedEvent && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{generatedEvent.title}</CardTitle>
                    {generatedEvent.date && (
                      <CardDescription>{generatedEvent.date}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedEvent.description && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Description</h3>
                        <p className="text-sm text-gray-600">{generatedEvent.description}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {generatedEvent.location && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Location</h3>
                          <p className="text-sm text-gray-600">{generatedEvent.location}</p>
                        </div>
                      )}
                      {generatedEvent.type && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Event Type</h3>
                          <p className="text-sm text-gray-600">{generatedEvent.type}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Event Options</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Ticket className="h-4 w-4 mr-2" />
                          Add Ticketing
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Share2 className="h-4 w-4 mr-2" />
                          Sharing Options
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Custom URL
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          More Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setActiveTab('chat')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Back to Chat
                    </Button>
                    <Button onClick={createEvent} disabled={isCreating}>
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      {isCreating ? 'Creating...' : 'Create Event'}
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="text-sm text-gray-500 italic">
                  Continue chatting to refine your event details before creating.
                </div>
              </>
            )}
          </TabsContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};
