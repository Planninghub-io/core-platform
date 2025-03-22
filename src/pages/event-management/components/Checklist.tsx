
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ListChecks, 
  CheckCircle2, 
  Calendar, 
  PlusCircle, 
  RefreshCw, 
  Clock, 
  FilterX,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  Truck,
  DollarSign,
  Megaphone,
  FileText
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  timeline: string;
  completed: boolean;
}

interface TimelineSection {
  timeline: string;
  items: {
    title: string;
    description: string;
    category: string;
  }[];
}

interface ChecklistProps {
  eventId: string;
  event: any;
}

export const Checklist: React.FC<ChecklistProps> = ({ eventId, event }) => {
  const { toast } = useToast();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Define the timeline order for sorting
  const timelineOrder = [
    "Immediately",
    "1 month before",
    "2 weeks before",
    "1 week before",
    "Day before",
    "Day of event",
    "Post-event"
  ];
  
  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'venue':
        return <Building2 className="h-4 w-4" />;
      case 'vendors':
        return <Users className="h-4 w-4" />;
      case 'guests':
        return <Users className="h-4 w-4" />;
      case 'logistics':
        return <Truck className="h-4 w-4" />;
      case 'budget':
        return <DollarSign className="h-4 w-4" />;
      case 'marketing':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Category color mapping
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'venue':
        return "bg-blue-100 text-blue-800";
      case 'vendors':
        return "bg-purple-100 text-purple-800";
      case 'guests':
        return "bg-green-100 text-green-800";
      case 'logistics':
        return "bg-yellow-100 text-yellow-800";
      case 'budget':
        return "bg-emerald-100 text-emerald-800";
      case 'marketing':
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Load saved checklist items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem(`checklist-${eventId}`);
    if (savedItems) {
      setChecklistItems(JSON.parse(savedItems));
    }
  }, [eventId]);
  
  // Save checklist items to localStorage whenever they change
  useEffect(() => {
    if (checklistItems.length > 0) {
      localStorage.setItem(`checklist-${eventId}`, JSON.stringify(checklistItems));
    }
  }, [checklistItems, eventId]);

  const generateChecklist = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-checklist', {
        body: { eventDetails: event }
      });

      if (error) {
        throw error;
      }

      if (data?.checklist) {
        // Convert the API response to our checklist format
        const newItems: ChecklistItem[] = [];
        data.checklist.forEach((section: TimelineSection) => {
          section.items.forEach(item => {
            newItems.push({
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: item.title,
              description: item.description,
              category: item.category,
              timeline: section.timeline,
              completed: false
            });
          });
        });

        setChecklistItems(newItems);
        toast({
          description: "Checklist generated successfully!",
        });

        // Auto-expand all sections
        const newExpandedSections: Record<string, boolean> = {};
        timelineOrder.forEach(timeline => {
          newExpandedSections[timeline] = true;
        });
        setExpandedSections(newExpandedSections);
      }
    } catch (error) {
      console.error("Error generating checklist:", error);
      toast({
        title: "Error",
        description: "Failed to generate checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemCompletion = (id: string) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addCustomItem = (timeline: string) => {
    const newItem: ChecklistItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: "New task",
      description: "Click to edit",
      category: "other",
      timeline,
      completed: false
    };
    
    setChecklistItems([...checklistItems, newItem]);
  };

  const deleteItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
    toast({
      description: "Item deleted",
    });
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setChecklistItems(
      checklistItems.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const toggleSectionExpand = (timeline: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [timeline]: !prev[timeline]
    }));
  };

  // Group items by timeline
  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.timeline]) {
      acc[item.timeline] = [];
    }
    acc[item.timeline].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Sort timelines by predefined order
  const sortedTimelines = Object.keys(groupedItems)
    .sort((a, b) => {
      const indexA = timelineOrder.indexOf(a);
      const indexB = timelineOrder.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

  const filteredTimelines = activeFilter
    ? sortedTimelines.filter(timeline => 
        groupedItems[timeline].some(item => 
          item.category.toLowerCase() === activeFilter.toLowerCase()))
    : sortedTimelines;

  // Calculate progress stats
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(item => item.completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const categoryFilters = [
    { value: "venue", label: "Venue" },
    { value: "vendors", label: "Vendors" },
    { value: "guests", label: "Guests" },
    { value: "logistics", label: "Logistics" },
    { value: "budget", label: "Budget" },
    { value: "marketing", label: "Marketing" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-[#8B5CF6]" />
              Event Checklist
            </CardTitle>
            <CardDescription>
              Track everything you need to do for your event
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {activeFilter && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveFilter(null)}
                className="flex items-center"
              >
                <FilterX className="mr-1 h-4 w-4" />
                Clear Filter
              </Button>
            )}
            <Button 
              onClick={generateChecklist} 
              disabled={isLoading}
              className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Checklist
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {checklistItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center mr-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{progressPercentage}% Complete</h3>
                    <p className="text-sm text-gray-500">{completedItems} of {totalItems} tasks completed</p>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryFilters.map(category => (
                  <Badge 
                    key={category.value}
                    className={`cursor-pointer ${activeFilter === category.value 
                      ? getCategoryColor(category.value)
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setActiveFilter(
                      activeFilter === category.value ? null : category.value
                    )}
                  >
                    {getCategoryIcon(category.value)}
                    <span className="ml-1">{category.label}</span>
                  </Badge>
                ))}
              </div>
              
              {filteredTimelines.length > 0 ? (
                <div className="space-y-6">
                  {filteredTimelines.map(timeline => {
                    const items = activeFilter
                      ? groupedItems[timeline].filter(item => 
                          item.category.toLowerCase() === activeFilter.toLowerCase())
                      : groupedItems[timeline];
                    
                    if (items.length === 0) return null;
                    
                    const isExpanded = expandedSections[timeline];
                    const timelineCompleted = items.every(item => item.completed);
                    
                    return (
                      <div 
                        key={timeline} 
                        className={`border rounded-lg overflow-hidden ${
                          timelineCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div 
                          className={`flex items-center justify-between p-4 cursor-pointer ${
                            timelineCompleted ? 'bg-green-100' : 'bg-gray-50'
                          }`}
                          onClick={() => toggleSectionExpand(timeline)}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <h3 className="font-medium">{timeline}</h3>
                            <Badge 
                              className="ml-2 bg-gray-200 text-gray-800"
                              variant="outline"
                            >
                              {items.filter(item => item.completed).length}/{items.length}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        {isExpanded && (
                          <div className="divide-y divide-gray-100">
                            {items.map(item => (
                              <div 
                                key={item.id} 
                                className={`p-4 ${item.completed ? 'bg-gray-50' : 'bg-white'}`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox 
                                    checked={item.completed} 
                                    onCheckedChange={() => toggleItemCompletion(item.id)}
                                    className={item.completed ? 'bg-green-500 text-white' : ''}
                                  />
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                      <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {item.title}
                                      </h4>
                                      
                                      <Badge className={`mt-1 sm:mt-0 self-start sm:self-auto ${getCategoryColor(item.category)}`}>
                                        {getCategoryIcon(item.category)}
                                        <span className="ml-1">{item.category}</span>
                                      </Badge>
                                    </div>
                                    
                                    <p className={`text-sm mt-1 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {item.description}
                                    </p>
                                  </div>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => deleteItem(item.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <div className="p-4 flex justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addCustomItem(timeline)}
                                className="text-[#8B5CF6]"
                              >
                                <PlusCircle className="mr-1 h-3 w-3" />
                                Add Item
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FilterX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No matching items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your filter or generate more items.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <ListChecks className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No checklist items</h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate a checklist based on your event details or add items manually.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={generateChecklist} 
                  disabled={isLoading}
                  className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Checklist
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
