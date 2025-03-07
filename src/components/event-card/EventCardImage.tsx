
import React, { useState } from "react";

interface EventCardImageProps {
  imageUrl: string;
  title: string;
}

const EventCardImage: React.FC<EventCardImageProps> = ({ imageUrl, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="aspect-[16/9] overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className={`h-full w-full object-cover transition-all duration-700 ${
          isLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"
        } group-hover:scale-110`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default EventCardImage;
