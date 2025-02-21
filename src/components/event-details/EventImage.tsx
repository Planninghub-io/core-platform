
import { Input } from "@/components/ui/input";

interface EventImageProps {
  imageUrl: string | null;
  isEditing: boolean;
  onImageChange: (value: string) => void;
}

export const EventImage = ({ imageUrl, isEditing, onImageChange }: EventImageProps) => {
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-xl">
      {isEditing ? (
        <Input
          type="text"
          value={imageUrl || ''}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="Image URL"
          className="mb-4"
        />
      ) : (
        <img
          src={imageUrl || '/placeholder.svg'}
          alt="Event"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};
