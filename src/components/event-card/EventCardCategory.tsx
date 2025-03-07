
import React from "react";

interface EventCardCategoryProps {
  category: string;
}

const EventCardCategory: React.FC<EventCardCategoryProps> = ({ category }) => {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {category}
      </span>
    </div>
  );
};

export default EventCardCategory;
