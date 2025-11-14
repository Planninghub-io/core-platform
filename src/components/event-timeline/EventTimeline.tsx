import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format, differenceInDays, isBefore, isAfter, addDays } from 'date-fns';

interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  category: string;
  assignee?: string;
}

interface EventTimelineProps {
  eventId: string;
  eventDate: string;
  eventTitle: string;
}

export const EventTimeline = ({ eventId, eventDate, eventTitle }: EventTimelineProps) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateTimeline();
  }, [eventId, eventDate]);

  const generateTimeline = () => {
    const eventDateObj = new Date(eventDate);
    const now = new Date();
    const daysUntilEvent = differenceInDays(eventDateObj, now);

    // Generate timeline items based on event date
    const items: TimelineItem[] = [
      {
        id: '1',
        title: 'Finalize Event Details',
        description: 'Confirm venue, date, and time',
        dueDate: addDays(eventDateObj, -30).toISOString(),
        status: daysUntilEvent < 30 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Planning',
      },
      {
        id: '2',
        title: 'Send Invitations',
        description: 'Distribute event invitations to attendees',
        dueDate: addDays(eventDateObj, -21).toISOString(),
        status: daysUntilEvent < 21 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Communication',
      },
      {
        id: '3',
        title: 'Confirm Catering',
        description: 'Finalize menu and catering arrangements',
        dueDate: addDays(eventDateObj, -14).toISOString(),
        status: daysUntilEvent < 14 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Logistics',
      },
      {
        id: '4',
        title: 'Book Equipment',
        description: 'Reserve A/V equipment and other rentals',
        dueDate: addDays(eventDateObj, -10).toISOString(),
        status: daysUntilEvent < 10 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Logistics',
      },
      {
        id: '5',
        title: 'Final Headcount',
        description: 'Get final RSVP count',
        dueDate: addDays(eventDateObj, -7).toISOString(),
        status: daysUntilEvent < 7 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Planning',
      },
      {
        id: '6',
        title: 'Setup Day Preparation',
        description: 'Prepare materials and coordinate setup',
        dueDate: addDays(eventDateObj, -3).toISOString(),
        status: daysUntilEvent < 3 ? (daysUntilEvent < 0 ? 'overdue' : 'completed') : 'pending',
        category: 'Logistics',
      },
      {
        id: '7',
        title: 'Event Day',
        description: eventTitle,
        dueDate: eventDate,
        status: daysUntilEvent < 0 ? 'completed' : 'pending',
        category: 'Event',
      },
      {
        id: '8',
        title: 'Post-Event Follow-up',
        description: 'Send thank you messages and gather feedback',
        dueDate: addDays(eventDateObj, 1).toISOString(),
        status: daysUntilEvent < -1 ? 'completed' : 'pending',
        category: 'Communication',
      },
    ];

    // Sort by due date
    items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setTimelineItems(items);
    setLoading(false);
  };

  const toggleItemStatus = (id: string) => {
    setTimelineItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newStatus = item.status === 'completed' ? 'pending' : 'completed';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500';
      case 'overdue':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Timeline</CardTitle>
        <CardDescription>Track your event planning progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {timelineItems.map((item, index) => {
              const dueDate = new Date(item.dueDate);
              const now = new Date();
              const isPast = isBefore(dueDate, now);
              const daysDiff = differenceInDays(dueDate, now);

              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(dueDate, 'MMM dd, yyyy')}
                          </div>
                          {daysDiff >= 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {daysDiff === 0 ? 'Today' : `${daysDiff} days ${isPast ? 'ago' : 'remaining'}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemStatus(item.id)}
                        className="ml-4"
                      >
                        {item.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

