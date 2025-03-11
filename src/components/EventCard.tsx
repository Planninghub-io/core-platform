
import { useNavigate } from "react-router-dom";
import EventCardImage from "./event-card/EventCardImage";
import EventCardOverlay from "./event-card/EventCardOverlay";
import EventCardDetails from "./event-card/EventCardDetails";
import EventCardEditButton from "./event-card/EventCardEditButton";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  endDate: string;
  location: string;
  imageUrl: string;
  category: string;
  createdBy: string;
  expectedAttendees?: number;
}

const EventCard = ({ 
  id,
  title, 
  date,
  endDate,
  location, 
  imageUrl, 
  category,
  createdBy,
  expectedAttendees 
}: EventCardProps) => {
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/event/${id}?edit=true`);
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/event/${id}`)}
    >
      <EventCardEditButton onClick={handleEdit} />
      <EventCardImage imageUrl={imageUrl} title={title} />
      <EventCardOverlay />
      <EventCardDetails
        title={title}
        date={date}
        endDate={endDate}
        location={location}
        category={category}
        createdBy={createdBy}
        expectedAttendees={expectedAttendees}
      />
    </div>
  );
};

export default EventCard;
