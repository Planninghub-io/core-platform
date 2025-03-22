
import React from "react";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventContent } from "@/components/event-details/EventContent";
import { Event } from "@/components/event-details/types/event";

interface EventDetailsLayoutProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onBack: () => void;
  onEditToggle: () => void;
  onViewModeChange: (mode: 'details' | 'ai' | 'dashboard') => void;
  onFieldChange: (field: string, value: string | number) => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  onCancelChanges?: () => void;
  onEditField?: (fieldName: string) => void;
  editingField?: string | null;
  onDelete?: () => void;
}

export const EventDetailsLayout: React.FC<EventDetailsLayoutProps> = ({
  event,
  isEditing,
  viewMode,
  onBack,
  onEditToggle,
  onViewModeChange,
  onFieldChange,
  hasUnsavedChanges = false,
  onSaveChanges = () => {},
  onCancelChanges = () => {},
  onEditField,
  editingField,
  onDelete
}) => {
  return (
    <div className="container py-8">
      <EventHeader
        isEditing={isEditing}
        id={event.id}
        onBack={onBack}
        onEditToggle={onEditToggle}
        onDashboard={() => onViewModeChange('dashboard')}
        onAiAssistant={() => onViewModeChange('ai')}
        status={event.status}
        event={event}
        activeView={viewMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveChanges={onSaveChanges}
        onCancelChanges={onCancelChanges}
      />
      
      <div className="mt-12">
        <EventContent
          event={event}
          isEditing={isEditing}
          viewMode={viewMode}
          onFieldChange={onFieldChange}
          onEditField={onEditField}
          editingField={editingField}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
