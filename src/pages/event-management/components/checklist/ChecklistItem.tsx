
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, X } from "lucide-react";
import { CategoryData, ChecklistItem as ChecklistItemType } from "./types";
import { getCategoryIcon, getCategoryColor } from "./utils";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEditing: (item: ChecklistItemType) => void;
  onCancelEditing: () => void;
  onSaveChanges: () => void;
  editingItemId: string | null;
  editFormData: Partial<ChecklistItemType>;
  onEditInputChange: (field: keyof ChecklistItemType, value: any) => void;
  categoryFilters: CategoryData[];
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggleCompletion,
  onDelete,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  editingItemId,
  editFormData,
  onEditInputChange,
  categoryFilters
}) => {
  const isEditing = editingItemId === item.id;

  return (
    <div 
      key={item.id} 
      className={`p-4 ${item.completed ? 'bg-gray-50' : 'bg-white'}`}
    >
      {isEditing ? (
        // Edit form
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={editFormData.title || ''} 
              onChange={(e) => onEditInputChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={editFormData.description || ''} 
              onChange={(e) => onEditInputChange('description', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={editFormData.category || ''} 
              onValueChange={(value) => onEditInputChange('category', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryFilters.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancelEditing}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={onSaveChanges}
              className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        // Regular view
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={item.completed} 
            onCheckedChange={() => onToggleCompletion(item.id)}
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
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStartEditing(item)}
              className="text-gray-500 hover:text-[#8B5CF6]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(item.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
