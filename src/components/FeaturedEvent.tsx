
import { Calendar, MapPin } from "lucide-react";

interface FeaturedEventProps {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  price: string;
}

const FeaturedEvent = ({
  title,
  description,
  date,
  location,
  imageUrl,
  price,
}: FeaturedEventProps) => {
  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="relative">
        <div className="aspect-[21/9] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h2 className="mb-2 text-3xl font-bold text-white">{title}</h2>
          <p className="mb-4 max-w-2xl text-lg text-white/90">{description}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="h-5 w-5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white p-6">
        <div>
          <span className="text-sm font-medium text-gray-500">Starting from</span>
          <p className="text-2xl font-bold text-primary">{price}</p>
        </div>
        <button className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FeaturedEvent;
