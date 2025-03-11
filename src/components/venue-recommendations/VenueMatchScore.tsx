
import React from "react";
import { Star } from "lucide-react";

interface VenueMatchScoreProps {
  score: number;
}

export const VenueMatchScore: React.FC<VenueMatchScoreProps> = ({ score }) => {
  // Convert 0-100 to 0-5 stars
  const stars = Math.round(score / 20);
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{score}% match</span>
    </div>
  );
};
