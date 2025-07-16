
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset state when imageUrl changes
    setIsLoaded(false);
    setHasError(false);
    
    if (imageUrl && imageUrl !== '/placeholder.svg') {
      // Check if the URL looks like an expired OpenAI URL
      const isOpenAIUrl = imageUrl.includes('oaidalleapiprodscus.blob.core.windows.net');
      const hasExpiredToken = imageUrl.includes('se=') && imageUrl.includes('st=');
      
      if (isOpenAIUrl && hasExpiredToken) {
        // Parse the expiration time from the URL
        const urlParams = new URLSearchParams(imageUrl.split('?')[1]);
        const expirationTime = urlParams.get('se');
        
        if (expirationTime) {
          const expiredAt = new Date(expirationTime);
          const now = new Date();
          
          // If the URL has expired, use placeholder immediately
          if (now > expiredAt) {
            console.log("OpenAI image URL has expired:", imageUrl);
            setDisplayImageUrl('/placeholder.svg');
            setHasError(true);
            setIsLoaded(true);
            return;
          }
        }
      }
      
      // Try to load the image
      setDisplayImageUrl(imageUrl);
      console.log("Using explicitly passed imageUrl:", imageUrl);
    } else {
      setDisplayImageUrl('/placeholder.svg');
      console.log("Using placeholder image");
      setIsLoaded(true);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", displayImageUrl);
    setHasError(true);
    setDisplayImageUrl('/placeholder.svg');
    setIsLoaded(true);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <img 
        src={displayImageUrl}
        alt={eventTitle || "Event"}
        className={`w-full h-[200px] object-cover rounded-lg transition-all duration-300 ${
          isLoaded ? "opacity-100" : "opacity-50"
        } hover:scale-105`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};
