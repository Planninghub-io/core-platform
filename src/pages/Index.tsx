
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import EventCard from "@/components/EventCard";
import FeaturedEvent from "@/components/FeaturedEvent";

const events = [
  {
    id: 1,
    title: "Summer Music Festival 2024",
    date: "July 15-17, 2024",
    location: "Central Park, NY",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    price: "$99",
    category: "Music",
  },
  {
    id: 2,
    title: "Tech Conference 2024",
    date: "August 5-7, 2024",
    location: "Convention Center, SF",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    price: "$299",
    category: "Technology",
  },
  {
    id: 3,
    title: "Food & Wine Festival",
    date: "September 10, 2024",
    location: "Downtown Area, Miami",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    price: "$75",
    category: "Food & Drink",
  },
  {
    id: 4,
    title: "International Film Festival",
    date: "October 1-5, 2024",
    location: "Various Venues, LA",
    imageUrl: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676",
    price: "$150",
    category: "Arts",
  },
];

const featuredEvent = {
  title: "Coachella Valley Music and Arts Festival",
  description: "Experience the world's most iconic music festival featuring top artists, incredible art installations, and unforgettable moments.",
  date: "April 12-21, 2024",
  location: "Indio, California",
  imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
  price: "$499",
};

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-primary pb-20 pt-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')] bg-cover bg-center bg-no-repeat opacity-10" />
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <h1 className="animate-fade-down mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Discover Amazing Events
            </h1>
            <p className="animate-fade-up mx-auto mb-8 max-w-2xl text-lg text-white/90">
              Find and book tickets for the best concerts, sports events, and shows happening near you.
            </p>
            <div className="flex flex-col items-center gap-4">
              <SearchBar />
              <button
                onClick={() => navigate("/create-event")}
                className="animate-fade-up rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-white/90"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Featured Event</h2>
          <FeaturedEvent {...featuredEvent} />
        </div>

        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
