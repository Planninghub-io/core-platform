
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignAIAssistant } from '@/components/campaign/ai-assistant/CampaignAIAssistant';
import { CampaignHeader } from '@/components/campaign/CampaignHeader';
import { EventsTabContent } from '@/components/campaign/EventsTabContent';
import { TabContent } from '@/components/campaign/TabContent';

const CampaignHub = () => {
  // Set showAIAssistant to true by default to show the chat interface immediately
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  
  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CampaignHeader 
        onOpenAIAssistant={() => setShowAIAssistant(true)} 
        showAIAssistant={showAIAssistant}
      />

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <EventsTabContent onOpenAIAssistant={() => setShowAIAssistant(true)} />
        </TabsContent>
        
        <TabsContent value="supporters" className="space-y-4">
          <TabContent 
            title="Supporter Management" 
            description="Organize and engage with your supporter base."
          />
        </TabsContent>
        
        <TabsContent value="messaging" className="space-y-4">
          <TabContent 
            title="Campaign Messaging" 
            description="Create and send targeted messages to your supporters."
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <TabContent 
            title="Campaign Analytics" 
            description="Track performance and measure impact."
          />
        </TabsContent>
      </Tabs>

      {showAIAssistant && (
        <CampaignAIAssistant 
          onClose={() => setShowAIAssistant(false)} 
          displayInline={true}
        />
      )}
    </div>
  );
};

export default CampaignHub;
