
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistItem, TimelineSection } from "../types";
import { timelineOrder } from "../utils";

export const useChecklistState = (eventId: string, event: any) => {
  const { toast } = useToast();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ChecklistItem>>({});

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
    setEditingItemId(newItem.id);
    setEditFormData(newItem);
  };

  const deleteItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
    toast({
      description: "Item deleted",
    });
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingItemId(item.id);
    setEditFormData({ ...item });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditFormData({});
  };

  const handleEditInputChange = (field: keyof ChecklistItem, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveItemChanges = () => {
    if (!editingItemId || !editFormData.title) return;
    
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === editingItemId
          ? {
              ...item,
              title: editFormData.title || item.title,
              description: editFormData.description || item.description,
              category: editFormData.category || item.category
            }
          : item
      )
    );
    
    setEditingItemId(null);
    setEditFormData({});
    toast({
      description: "Item updated successfully",
    });
  };

  const toggleSectionExpand = (timeline: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [timeline]: !prev[timeline]
    }));
  };

  const toggleFilter = (category: string) => {
    setActiveFilter(prevFilter => 
      prevFilter === category ? null : category
    );
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

  return {
    checklistItems,
    isLoading,
    activeFilter,
    expandedSections,
    editingItemId,
    editFormData,
    groupedItems,
    sortedTimelines,
    filteredTimelines,
    totalItems,
    completedItems,
    progressPercentage,
    generateChecklist,
    toggleItemCompletion,
    addCustomItem,
    deleteItem,
    startEditing,
    cancelEditing,
    handleEditInputChange,
    saveItemChanges,
    toggleSectionExpand,
    toggleFilter,
    clearFilter: () => setActiveFilter(null)
  };
};
