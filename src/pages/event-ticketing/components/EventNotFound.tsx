
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EventNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-6">The event you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/events-hub')}>Back to Events</Button>
      </div>
    </div>
  );
};
