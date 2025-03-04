
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
}

export const EventDetailsLayout: React.FC<EventDetailsLayoutProps> = ({
  event,
  isEditing,
  viewMode,
  onBack,
  onEditToggle,
  onViewModeChange,
  onFieldChange
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
      />
      
      {/* Added margin-top to create more separation */}
      <div className="mt-12">
        <EventContent
          event={event}
          isEditing={isEditing}
          viewMode={viewMode}
          onFieldChange={onFieldChange}
        />
      </div>
    </div>
  );
};
