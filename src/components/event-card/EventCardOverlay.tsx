
import React from "react";

const EventCardOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  );
};

export default EventCardOverlay;
