
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignHeaderProps {
  onOpenAIAssistant: () => void;
}

export const CampaignHeader = ({ onOpenAIAssistant }: CampaignHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Campaign Hub</h1>
        <p className="text-lg text-gray-600 mt-1">Organize, engage, and mobilize your supporters</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onOpenAIAssistant}>
          <MessageSquare className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
};
