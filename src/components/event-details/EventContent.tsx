
import { EventInfo } from "./EventInfo";
import { EventDashboard } from "./EventDashboard";
import { LeftPanel } from "./components/LeftPanel";
import { Event } from "./types/event";

interface EventContentProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onFieldChange: (field: string, value: string | number) => void;
  onEditField?: (fieldName: string) => void;
  editingField?: string | null;
  onDelete?: () => void;
}

export const EventContent = ({
  event,
  isEditing,
  viewMode,
  onFieldChange,
  onEditField,
  editingField,
  onDelete
}: EventContentProps) => {
  if (viewMode === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <EventDashboard event={event} />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <LeftPanel 
          event={event}
          isEditing={isEditing}
          viewMode={viewMode}
          onFieldChange={onFieldChange}
          onEditField={onEditField}
        />
      </div>
      <div>
        <EventInfo
          event={event}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
          onEditField={onEditField}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
