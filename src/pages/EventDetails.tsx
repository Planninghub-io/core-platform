
import React from "react";
import { useEventDetails } from "./event-details/hooks/useEventDetails";
import { EventDetailsLayout } from "./event-details/components/EventDetailsLayout";
import { EventDetailsLoading } from "./event-details/components/EventDetailsLoading";
import { EventNotFound } from "./event-details/components/EventNotFound";

const EventDetails: React.FC = () => {
  const {
    event,
    loading,
    isEditing,
    viewMode,
    hasUnsavedChanges,
    handleBack,
    handleEditToggle,
    handleViewModeChange,
    handleInputChange,
    handleSaveChanges,
    handleCancelChanges
  } = useEventDetails();

  if (loading) {
    return <EventDetailsLoading />;
  }

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <EventDetailsLayout
      event={event}
      isEditing={isEditing}
      viewMode={viewMode}
      onBack={handleBack}
      onEditToggle={handleEditToggle}
      onViewModeChange={handleViewModeChange}
      onFieldChange={handleInputChange}
      hasUnsavedChanges={hasUnsavedChanges}
      onSaveChanges={handleSaveChanges}
      onCancelChanges={handleCancelChanges}
    />
  );
};

export default EventDetails;
