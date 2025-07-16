
import React, { useState, useEffect } from "react";

interface EventCardImageProps {
  imageUrl: string;
  title: string;
}

const EventCardImage: React.FC<EventCardImageProps> = ({ imageUrl, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayUrl, setDisplayUrl] = useState('/placeholder.svg');
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
            setDisplayUrl('/placeholder.svg');
            setHasError(true);
            setIsLoaded(true);
            return;
          }
        }
      }
      
      // Try to load the image
      setDisplayUrl(imageUrl);
    } else {
      // No image URL provided, use placeholder
      setDisplayUrl('/placeholder.svg');
      setIsLoaded(true);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    console.log("Failed to load image:", imageUrl);
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
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default EventCardImage;
