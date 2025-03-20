
import { EventImage } from "../EventImage";
import { EventAIDialog } from "../EventAIDialog";
import { EventActionButtons } from "./EventActionButtons";
import { useEventFeatures } from "../hooks/useEventFeatures";
import { Event } from "../types/event";

interface LeftPanelProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onFieldChange: (field: string, value: string | number) => void;
}

export const LeftPanel = ({
  event,
  isEditing,
  viewMode,
  onFieldChange
}: LeftPanelProps) => {
  const { hasInvites, hasTicketing, generateInvitation } = useEventFeatures({ eventId: event.id });

  if (viewMode === 'ai') {
    return (
      <div className="bg-card rounded-xl p-6 h-full">
        <EventAIDialog 
          event={event} 
          embedded={true} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventImage
        imageUrl={event.image_url}
        isEditing={isEditing}
        onImageChange={(value) => onFieldChange('image_url', value)}
      />
      
      <EventActionButtons 
        eventId={event.id}
        hasInvites={hasInvites}
        hasTicketing={hasTicketing}
        onGenerateInvitation={generateInvitation}
        category={event.category}
      />
    </div>
  );
};
