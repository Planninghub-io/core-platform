
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from "@/components/event-details/types/event";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  completed: boolean;
}

interface EventPlannerProps {
  eventId: string;
  event: Event;
}

export const EventPlanner: React.FC<EventPlannerProps> = ({ eventId, event }) => {
  const { toast } = useToast();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<TimelineItem>>({
    title: "",
    date: "",
    time: "",
    type: "activity",
    description: ""
  });

  const handleAddItem = () => {
    if (!currentItem.title || !currentItem.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (currentItem.id) {
      // Update existing item
      setTimelineItems(
        timelineItems.map(item => 
          item.id === currentItem.id 
            ? { ...item, ...currentItem as TimelineItem } 
            : item
        )
      );
      toast({
        description: "Timeline item updated successfully",
      });
    } else {
      // Add new item
      const newItem: TimelineItem = {
        id: Date.now().toString(),
        title: currentItem.title || "",
        date: currentItem.date || "",
        time: currentItem.time || "",
        type: currentItem.type || "activity",
        description: currentItem.description || "",
        completed: false
      };
      
      setTimelineItems([...timelineItems, newItem]);
      toast({
        description: "Timeline item added successfully",
      });
    }
    
    setDialogOpen(false);
    setCurrentItem({
      title: "",
      date: "",
      time: "",
      type: "activity",
      description: ""
    });
  };

  const handleEditItem = (item: TimelineItem) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setTimelineItems(timelineItems.filter(item => item.id !== id));
    toast({
      description: "Timeline item deleted",
    });
  };

  const handleToggleComplete = (id: string) => {
    setTimelineItems(
      timelineItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const itemTypes = [
    { value: "activity", label: "Activity", color: "bg-blue-100 text-blue-800" },
    { value: "milestone", label: "Milestone", color: "bg-green-100 text-green-800" },
    { value: "deadline", label: "Deadline", color: "bg-red-100 text-red-800" },
    { value: "meeting", label: "Meeting", color: "bg-purple-100 text-purple-800" }
  ];

  // Sort timeline items by date and time
  const sortedItems = [...timelineItems].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Group timeline items by date
  const groupedItems: Record<string, TimelineItem[]> = {};
  sortedItems.forEach(item => {
    if (!groupedItems[item.date]) {
      groupedItems[item.date] = [];
    }
    groupedItems[item.date].push(item);
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 h-6 w-6 text-[#8B5CF6]" />
              Event Timeline & Planner
            </CardTitle>
            <CardDescription>
              Create a detailed plan for your event
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setCurrentItem({
                title: "",
                date: "",
                time: "",
                type: "activity",
                description: ""
              });
              setDialogOpen(true);
            }} 
            className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Timeline
          </Button>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No timeline items</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start building your event timeline by adding activities, deadlines, or milestones.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => {
                    setCurrentItem({
                      title: "",
                      date: "",
                      time: "",
                      type: "activity",
                      description: ""
                    });
                    setDialogOpen(true);
                  }}
                  className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Timeline
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-8">
              {Object.keys(groupedItems).sort().map(date => (
                <div key={date} className="space-y-4">
                  <div className="sticky top-0 bg-white py-2 z-10">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-[#8B5CF6]" />
                      {formatDate(date)}
                    </h3>
                    <Separator className="mt-2" />
                  </div>
                  <div className="space-y-3 pl-6">
                    {groupedItems[date].map(item => {
                      const typeInfo = itemTypes.find(t => t.value === item.type) || itemTypes[0];
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`relative flex p-4 border rounded-lg ${
                            item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="absolute left-0 top-1/2 transform -translate-x-4 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {item.title}
                                  </h4>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                                    {typeInfo.label}
                                  </span>
                                </div>
                                {item.time && (
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {item.time}
                                  </div>
                                )}
                                <p className={`text-sm mt-1 ${item.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.description}
                                </p>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleToggleComplete(item.id)}>
                                    {item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-500" 
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem.id ? 'Edit Timeline Item' : 'Add Timeline Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={currentItem.title} 
                onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                placeholder="Enter title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={currentItem.date} 
                  onChange={(e) => setCurrentItem({...currentItem, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (optional)</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={currentItem.time} 
                  onChange={(e) => setCurrentItem({...currentItem, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={currentItem.type} 
                onValueChange={(value) => setCurrentItem({...currentItem, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                value={currentItem.description} 
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
              {currentItem.id ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
