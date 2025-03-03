
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEventData } from "@/hooks/useEventData";

export const useEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [viewMode, setViewMode] = useState<'details' | 'ai' | 'dashboard'>('details');
  
  const { event, loading, handleInputChange, handleDelete } = useEventData(id!);

  const handleDeleteAndNavigate = async () => {
    const success = await handleDelete();
    if (success) {
      navigate('/events-hub');
    }
  };

  const handleEditToggle = () => {
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
    handleBack,
    handleEditToggle,
    handleViewModeChange,
    handleInputChange,
    handleDeleteAndNavigate
  };
};
