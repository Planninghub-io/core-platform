
import React, { useState, useEffect } from "react";

interface EventCardImageProps {
  imageUrl: string;
  title: string;
}

const EventCardImage: React.FC<EventCardImageProps> = ({ imageUrl, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(imageUrl || '/placeholder.svg');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setDisplayUrl(imageUrl);
      setHasError(false);
    } else {
      setDisplayUrl('/placeholder.svg');
    }
  }, [imageUrl]);

  const handleImageError = () => {
    console.error("Failed to load image:", imageUrl);
    setHasError(true);
    setDisplayUrl('/placeholder.svg');
    setIsLoaded(true);
  };

  return (
    <div className="aspect-[16/9] overflow-hidden">
      <img
        src={displayUrl}
        alt={title}
        className={`h-full w-full object-cover transition-all duration-700 ${
          isLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"
        } group-hover:scale-110`}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
      />
    </div>
  );
};

export default EventCardImage;
