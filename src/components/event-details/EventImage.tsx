
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit2 } from "lucide-react";

interface EventImageProps {
  imageUrl: string | null;
  isEditing: boolean;
  onImageChange: (value: string) => void;
  onEditField?: () => void;
}

export const EventImage = ({ imageUrl, isEditing, onImageChange, onEditField }: EventImageProps) => {
  const [displayImageUrl, setDisplayImageUrl] = useState<string>('/placeholder.svg');
  const [imageError, setImageError] = useState(false);
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>(imageUrl || '');

  useEffect(() => {
    if (imageUrl) {
      setDisplayImageUrl(imageUrl);
      setTempImageUrl(imageUrl);
      setImageError(false);
    } else {
      setDisplayImageUrl('/placeholder.svg');
      setTempImageUrl('');
    }
  }, [imageUrl]);

  const handleImageError = () => {
    console.error("Image failed to load:", displayImageUrl);
    setImageError(true);
    setDisplayImageUrl('/placeholder.svg');
  };

  const handleEditClick = () => {
    if (onEditField) {
      onEditField();
    }
    setIsFieldEditing(true);
  };

  const handleSaveClick = () => {
    onImageChange(tempImageUrl);
    setIsFieldEditing(false);
  };

  const handleCancelClick = () => {
    setTempImageUrl(imageUrl || '');
    setIsFieldEditing(false);
  };

  return (
    <div className="aspect-[16/9] overflow-hidden rounded-xl relative group">
      {(isEditing || isFieldEditing) ? (
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              placeholder="Image URL"
              className="mb-2"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                onClick={handleCancelClick}
                className="h-7 w-7 p-0"
                variant="ghost"
              >
                <X className="h-3 w-3 text-gray-500" />
              </Button>
              <Button
                size="sm"
                onClick={handleSaveClick}
                className="h-7 w-7 p-0"
                variant="ghost"
              >
                <Check className="h-3 w-3 text-green-500" />
              </Button>
            </div>
          </div>
          {tempImageUrl && (
            <div className="border rounded-md p-2 mt-2">
              <img
                src={tempImageUrl}
                alt="Event preview"
                className="h-32 w-full object-cover rounded"
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <img
            src={displayImageUrl}
            alt="Event"
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
          {!isEditing && onEditField && (
            <Button 
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/50"
              size="sm"
              variant="ghost"
              onClick={handleEditClick}
            >
              <Edit2 className="h-4 w-4 text-white" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
