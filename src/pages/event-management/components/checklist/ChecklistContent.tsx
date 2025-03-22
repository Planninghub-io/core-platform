
import React from "react";
import { TimelineSection } from "./TimelineSection";
import { NoMatchingItems } from "./NoMatchingItems";
import { ChecklistItem } from "./types";
import { categoryFilters } from "./utils";

interface ChecklistContentProps {
  filteredTimelines: string[];
  groupedItems: Record<string, ChecklistItem[]>;
  expandedSections: Record<string, boolean>;
  activeFilter: string | null;
  editingItemId: string | null;
  editFormData: Partial<ChecklistItem>;
  onToggleSectionExpand: (timeline: string) => void;
  onAddCustomItem: (timeline: string) => void;
  onToggleItemCompletion: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onStartEditing: (item: ChecklistItem) => void;
  onCancelEditing: () => void;
  onSaveChanges: () => void;
  onEditInputChange: (field: keyof ChecklistItem, value: any) => void;
}

export const ChecklistContent: React.FC<ChecklistContentProps> = ({
  filteredTimelines,
  groupedItems,
  expandedSections,
  activeFilter,
  editingItemId,
  editFormData,
  onToggleSectionExpand,
  onAddCustomItem,
  onToggleItemCompletion,
  onDeleteItem,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  onEditInputChange
}) => {
  if (filteredTimelines.length === 0) {
    return <NoMatchingItems />;
  }

  return (
    <div className="space-y-6">
      {filteredTimelines.map(timeline => {
        const items = activeFilter
          ? groupedItems[timeline].filter(item => 
              item.category.toLowerCase() === activeFilter.toLowerCase())
          : groupedItems[timeline];
        
        if (items.length === 0) return null;
        
        return (
          <TimelineSection
            key={timeline}
            timeline={timeline}
            items={items}
            isExpanded={!!expandedSections[timeline]}
            onToggleExpand={() => onToggleSectionExpand(timeline)}
            onAddCustomItem={() => onAddCustomItem(timeline)}
            onToggleItemCompletion={onToggleItemCompletion}
            onDeleteItem={onDeleteItem}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSaveChanges={onSaveChanges}
            editingItemId={editingItemId}
            editFormData={editFormData}
            onEditInputChange={onEditInputChange}
            categoryFilters={categoryFilters}
          />
        );
      })}
    </div>
  );
};
