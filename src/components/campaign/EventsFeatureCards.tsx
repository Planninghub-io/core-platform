
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Share2, Ticket } from 'lucide-react';

export const EventsFeatureCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <Users className="h-8 w-8 text-indigo-600 mb-2" />
          <CardTitle>Targeted Engagement</CardTitle>
          <CardDescription>
            Reach the right supporters at the right time with targeted invitations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Filter supporters by location, interests, and history</li>
            <li>Customize outreach for different audiences</li>
            <li>Track response rates and optimize engagement</li>
          </ul>
          <Button variant="ghost" className="mt-4 w-full justify-start px-0 text-indigo-600 hover:text-indigo-700">
            Manage supporters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Share2 className="h-8 w-8 text-indigo-600 mb-2" />
          <CardTitle>Multi-channel Invitations</CardTitle>
          <CardDescription>
            Distribute invitations across multiple channels to maximize attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Send invites via email, SMS, and social media</li>
            <li>Create shareable links for supporters to forward</li>
            <li>Schedule automated reminders for upcoming events</li>
          </ul>
          <Button variant="ghost" className="mt-4 w-full justify-start px-0 text-indigo-600 hover:text-indigo-700">
            Create invitations
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Ticket className="h-8 w-8 text-indigo-600 mb-2" />
          <CardTitle>Ticketing & Check-in</CardTitle>
          <CardDescription>
            Manage event attendance with professional ticketing tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Create free or paid tickets for any event</li>
            <li>Generate unique QR codes for smooth check-in</li>
            <li>Track attendance and collect valuable data</li>
          </ul>
          <Button variant="ghost" className="mt-4 w-full justify-start px-0 text-indigo-600 hover:text-indigo-700">
            Manage tickets
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
