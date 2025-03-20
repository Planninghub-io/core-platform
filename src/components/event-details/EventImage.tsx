
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface EventImageProps {
  imageUrl: string | null;
  isEditing: boolean;
  onImageChange: (value: string) => void;
}

export const EventImage = ({ imageUrl, isEditing, onImageChange }: EventImageProps) => {
  const [displayImageUrl, setDisplayImageUrl] = useState<string>('/placeholder.svg');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setDisplayImageUrl(imageUrl);
      setImageError(false);
    } else {
      setDisplayImageUrl('/placeholder.svg');
    }
  }, [imageUrl]);

  const handleImageError = () => {
    console.error("Image failed to load:", displayImageUrl);
    setImageError(true);
    setDisplayImageUrl('/placeholder.svg');
  };

  return (
    <div className="aspect-[16/9] overflow-hidden rounded-xl">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            type="text"
            value={imageUrl || ''}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="Image URL"
            className="mb-4"
          />
          {imageUrl && !imageError && (
            <div className="border rounded-md p-2 mt-2">
              <img
                src={displayImageUrl}
                alt="Event preview"
                className="h-32 w-full object-cover rounded"
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      ) : (
        <img
          src={displayImageUrl}
          alt="Event"
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      )}
    </div>
  );
};
