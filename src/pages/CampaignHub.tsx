
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, MessageSquare, Share2, Settings, Ticket, Users } from 'lucide-react';
import { CampaignAIAssistant } from '@/components/campaign/CampaignAIAssistant';

const CampaignHub = () => {
  const navigate = useNavigate();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Campaign Hub</h1>
          <p className="text-lg text-gray-600 mt-1">Organize, engage, and mobilize your supporters</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowAIAssistant(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-6">
          {/* Hero section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
            <div className="relative px-6 py-12 md:px-10 md:py-16 lg:py-20">
              <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold sm:text-4xl">Create and manage powerful campaign events</h2>
                  <p className="text-white/80 leading-relaxed">
                    Design events that engage supporters, build community, and drive action. From rallies to phonebanks to fundraisers, our platform helps you organize with ease.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button size="lg" className="font-medium bg-white text-indigo-700 hover:bg-white/90" onClick={() => navigate('/create-event')}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Create New Event
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setShowAIAssistant(true)}>
                      Use AI Assistant
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="/placeholder.svg" 
                    alt="Campaign Event" 
                    className="h-full w-full object-cover rounded-lg" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
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

          {/* Recent events section */}
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
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="supporters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supporter Management</CardTitle>
              <CardDescription>
                Organize and engage with your supporter base.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Supporter management content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Messaging</CardTitle>
              <CardDescription>
                Create and send targeted messages to your supporters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Messaging tools content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>
                Track performance and measure impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics dashboard content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAIAssistant && (
        <CampaignAIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  );
};

export default CampaignHub;
