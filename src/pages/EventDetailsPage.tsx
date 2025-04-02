
import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetailsPage = () => {
  const { eventId } = useParams();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>
      <div className="p-6 rounded-lg bg-white shadow-md">
        <p>Viewing details for event ID: {eventId}</p>
        {/* Event details will be displayed here */}
      </div>
    </div>
  );
};

export default EventDetailsPage;
