
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

export const RecentEventsSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Recent Events</h3>
        <Button variant="ghost" className="text-indigo-600" onClick={() => navigate('/events-hub')}>
          View all events
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img 
                src="/placeholder.svg" 
                alt="Event" 
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Campaign Event {item}</CardTitle>
              <p className="text-sm text-gray-500">April {10 + item}, 2023 • Virtual</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4">
                A brief description of this campaign event and what attendees can expect.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {20 + item * 5} Attendees
                </span>
                <Button variant="outline" size="sm" onClick={() => navigate(`/events/sample-${item}`)}>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
