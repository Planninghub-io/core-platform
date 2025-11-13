
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventData } from "@/hooks/useEventData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TeamManagement } from "./components/TeamManagement";
import { Checklist } from "./components/Checklist";
import { EventPlanner } from "./components/EventPlanner";
import { ExpenseTracker } from "@/components/expense-tracking/ExpenseTracker";
import { EventTimeline } from "@/components/event-timeline/EventTimeline";

const EventManagement: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, loading } = useEventData(eventId || "");
  const [activeTab, setActiveTab] = useState("team");

  console.log("EventManagement: Rendering with eventId =", eventId);
  console.log("EventManagement: Event data =", event);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(`/events/${eventId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Loading event management...</h1>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Event not found</h1>
        </div>
        <p>Sorry, the event you're looking for doesn't exist or you don't have permission to access it.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(`/events/${eventId}`)}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Managing: {event.title}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="team">Event Team</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="planner">Event Planner</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team" className="mt-6">
          <TeamManagement eventId={eventId || ""} />
        </TabsContent>
        
        <TabsContent value="checklist" className="mt-6">
          <Checklist eventId={eventId || ""} event={event} />
        </TabsContent>
        
        <TabsContent value="planner" className="mt-6">
          <EventPlanner eventId={eventId || ""} event={event} />
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-6">
          <ExpenseTracker eventId={eventId || ""} eventBudget={typeof event.budget === 'string' ? parseFloat(event.budget) || null : event.budget ?? null} />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <EventTimeline eventId={eventId || ""} eventDate={event.date} eventTitle={event.title} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
