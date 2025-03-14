
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEventData } from "@/hooks/useEventData";
import { useToast } from "@/components/ui/use-toast";

export const useEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [viewMode, setViewMode] = useState<'details' | 'ai' | 'dashboard'>('details');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalEventData, setOriginalEventData] = useState<any>(null);
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
    navigate(isEditing ? `/event/${id}` : `/event/${id}?edit=true`);
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
    handleBack,
    handleEditToggle,
    handleViewModeChange,
    handleInputChange,
    handleDeleteAndNavigate,
    handleSaveChanges,
    handleCancelChanges
  };
};
