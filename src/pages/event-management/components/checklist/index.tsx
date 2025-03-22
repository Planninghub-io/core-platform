
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useChecklistState } from "./hooks/useChecklistState";
import { ChecklistHeader } from "./ChecklistHeader";
import { ChecklistContent } from "./ChecklistContent";
import { EmptyChecklist } from "./EmptyChecklist";
import { categoryFilters } from "./utils";

interface ChecklistProps {
  eventId: string;
  event: any;
}

export const Checklist: React.FC<ChecklistProps> = ({ eventId, event }) => {
  const {
    checklistItems,
    isLoading,
    activeFilter,
    expandedSections,
    editingItemId,
    editFormData,
    groupedItems,
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
    clearFilter
  } = useChecklistState(eventId, event);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <ChecklistHeader
            onGenerateChecklist={generateChecklist}
            isLoading={isLoading}
            activeFilter={activeFilter}
            onClearFilter={clearFilter}
            categoryFilters={categoryFilters}
            onFilterClick={toggleFilter}
            totalItems={totalItems}
            completedItems={completedItems}
            progressPercentage={progressPercentage}
          />
        </CardHeader>
        
        <CardContent>
          {checklistItems.length > 0 ? (
            <div className="space-y-6">
              <ChecklistContent
                filteredTimelines={filteredTimelines}
                groupedItems={groupedItems}
                expandedSections={expandedSections}
                activeFilter={activeFilter}
                editingItemId={editingItemId}
                editFormData={editFormData}
                onToggleSectionExpand={toggleSectionExpand}
                onAddCustomItem={addCustomItem}
                onToggleItemCompletion={toggleItemCompletion}
                onDeleteItem={deleteItem}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onSaveChanges={saveItemChanges}
                onEditInputChange={handleEditInputChange}
              />
            </div>
          ) : (
            <EmptyChecklist
              onGenerateChecklist={generateChecklist}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
