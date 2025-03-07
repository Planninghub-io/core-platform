
import React from "react";
import { Pencil } from "lucide-react";

interface EventCardEditButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const EventCardEditButton: React.FC<EventCardEditButtonProps> = ({ onClick }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onClick}
        className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

export default EventCardEditButton;
