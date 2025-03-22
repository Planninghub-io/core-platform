
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItem as ChecklistItemType } from "./types";

interface TimelineSectionProps {
  timeline: string;
  items: ChecklistItemType[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddCustomItem: () => void;
  onToggleItemCompletion: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onStartEditing: (item: ChecklistItemType) => void;
  onCancelEditing: () => void;
  onSaveChanges: () => void;
  editingItemId: string | null;
  editFormData: Partial<ChecklistItemType>;
  onEditInputChange: (field: keyof ChecklistItemType, value: any) => void;
  categoryFilters: any[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timeline,
  items,
  isExpanded,
  onToggleExpand,
  onAddCustomItem,
  onToggleItemCompletion,
  onDeleteItem,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  editingItemId,
  editFormData,
  onEditInputChange,
  categoryFilters
}) => {
  const timelineCompleted = items.every(item => item.completed);

  return (
    <div 
      className={`border rounded-lg overflow-hidden ${
        timelineCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
    >
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          timelineCompleted ? 'bg-green-100' : 'bg-gray-50'
        }`}
        onClick={onToggleExpand}
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
            <ChecklistItem
              key={item.id}
              item={item}
              onToggleCompletion={onToggleItemCompletion}
              onDelete={onDeleteItem}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onSaveChanges={onSaveChanges}
              editingItemId={editingItemId}
              editFormData={editFormData}
              onEditInputChange={onEditInputChange}
              categoryFilters={categoryFilters}
            />
          ))}
          
          <div className="p-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAddCustomItem}
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
};
