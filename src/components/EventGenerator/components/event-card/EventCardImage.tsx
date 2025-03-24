
import React, { useState, useEffect } from "react";

interface EventCardImageProps {
  imageUrl?: string;
  eventTitle: string;
  displayImage?: string;
}

export const EventCardImage: React.FC<EventCardImageProps> = ({
  imageUrl,
  eventTitle,
  displayImage = '/placeholder.svg'
}) => {
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(displayImage);
  
  // Determine which image URL to use, with proper fallbacks
  useEffect(() => {
    // Priority: explicitly passed imageUrl > event.imageUrl > placeholder
    if (imageUrl) {
      setDisplayImageUrl(imageUrl);
      console.log("Using explicitly passed imageUrl:", imageUrl);
    } else {
      setDisplayImageUrl('/placeholder.svg');
      console.log("Using placeholder image");
    }
  }, [imageUrl]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <img 
        src={displayImageUrl}
        alt={eventTitle || "Event"}
        className="w-full h-[200px] object-cover animate-fade-in rounded-lg transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          console.error("Image failed to load:", displayImageUrl);
          setDisplayImageUrl('/placeholder.svg');
        }}
      />
    </div>
  );
};
