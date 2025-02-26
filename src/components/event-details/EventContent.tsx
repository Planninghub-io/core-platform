
import { EventImage } from "./EventImage";
import { EventInfo } from "./EventInfo";
import { EventAIDialog } from "./EventAIDialog";
import { EventDashboard } from "./EventDashboard";

interface Event {
  id: string;
  title: string;
  date: string;
  end_date: string;
  description: string | null;
  location: string | null;
  category: string | null;
  expected_attendees: number | null;
  image_url: string | null;
  status?: string;
}

interface EventContentProps {
  event: Event;
  isEditing: boolean;
  viewMode: 'details' | 'ai' | 'dashboard';
  onFieldChange: (field: string, value: string | number) => void;
}

export const EventContent = ({
  event,
  isEditing,
  viewMode,
  onFieldChange
}: EventContentProps) => {
  if (viewMode === 'dashboard') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <EventDashboard event={event} />
      </div>
    );
  }

  const renderLeftPanel = () => {
    switch (viewMode) {
      case 'ai':
        return (
          <div className="bg-card rounded-xl p-6 h-full">
            <EventAIDialog 
              event={event} 
              embedded={true} 
            />
          </div>
        );
      default:
        return (
          <EventImage
            imageUrl={event.image_url}
            isEditing={isEditing}
            onImageChange={(value) => onFieldChange('image_url', value)}
          />
        );
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {renderLeftPanel()}
      <EventInfo
        event={event}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
      />
    </div>
  );
};
