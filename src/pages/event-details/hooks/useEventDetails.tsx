
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEventData } from "@/hooks/useEventData";
import { useToast } from "@/components/ui/use-toast";

export const useEventDetails = () => {
  const { eventId: id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [viewMode, setViewMode] = useState<'details' | 'ai' | 'dashboard'>('details');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalEventData, setOriginalEventData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    event, 
    loading, 
    handleInputChange: originalHandleInputChange, 
    handleDelete,
    saveChanges 
  } = useEventData(id!);

  // When event data is loaded or editing mode changes, store original data
  useEffect(() => {
    if (event && isEditing) {
      setOriginalEventData(JSON.parse(JSON.stringify(event)));
    } else {
      setHasUnsavedChanges(false);
    }
  }, [event, isEditing]);

  const handleInputChange = (field: string, value: string | number) => {
    setHasUnsavedChanges(true);
    originalHandleInputChange(field, value);
  };

  const handleSaveChanges = async () => {
    if (event) {
      await saveChanges(event);
      setHasUnsavedChanges(false);
      setEditingField(null);
      toast({
        description: "Changes saved successfully",
      });
    }
  };

  const handleCancelChanges = () => {
    if (originalEventData && event) {
      // Restore original values for each field
      Object.keys(originalEventData).forEach(key => {
        if (originalEventData[key] !== event[key]) {
          originalHandleInputChange(key, originalEventData[key]);
        }
      });
      setHasUnsavedChanges(false);
      setEditingField(null);
    }
  };

  const handleDeleteAndNavigate = async () => {
    const success = await handleDelete();
    if (success) {
      navigate('/events-hub');
    }
  };

  const handleEditToggle = () => {
    if (isEditing && hasUnsavedChanges) {
      // When exiting edit mode with changes, save them
      handleSaveChanges();
    }
    setEditingField(null);
    navigate(isEditing ? `/events/${id}` : `/events/${id}?edit=true`);
  };

  // Handle field-level editing
  const handleEditField = (fieldName: string) => {
    setEditingField(fieldName);
    setSearchParams({ edit: 'true' });
    setHasUnsavedChanges(true);
  };

  const handleBack = () => {
    navigate('/events-hub');
  };

  const handleViewModeChange = (mode: 'details' | 'ai' | 'dashboard') => {
    setViewMode(mode === viewMode ? 'details' : mode);
  };

  return {
    id,
    event,
    loading,
    isEditing,
    viewMode,
    hasUnsavedChanges,
    editingField,
    handleBack,
    handleEditToggle,
    handleViewModeChange,
    handleInputChange,
    handleDeleteAndNavigate,
    handleSaveChanges,
    handleCancelChanges,
    handleEditField
  };
};
