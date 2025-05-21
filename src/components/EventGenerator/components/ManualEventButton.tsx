
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface ManualEventButtonProps {
  show: boolean;
  onClick: () => void;
  eventPrompt?: string; // Add prop to receive event details
}

export const ManualEventButton = ({ show, onClick, eventPrompt }: ManualEventButtonProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const langflowRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="langflow-embedded-chat"]')) {
      setScriptLoaded(true);
      return;
    }
    
    // Load the script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
    
    return () => {
      // Cleanup is not needed as the script should remain for the application lifetime
    };
  }, []);

  // Effect to send event prompt to langflow chat when available
  useEffect(() => {
    if (scriptLoaded && eventPrompt && langflowRef.current) {
      // Use setTimeout to ensure the langflow-chat is fully initialized
      setTimeout(() => {
        // Try to send the message to the langflow chat
        try {
          const event = new CustomEvent('user-message', { detail: eventPrompt });
          langflowRef.current?.dispatchEvent(event);
          console.log('Sent event prompt to langflow chat:', eventPrompt);
        } catch (error) {
          console.error('Failed to send message to langflow chat:', error);
        }
      }, 1500);
    }
  }, [scriptLoaded, eventPrompt]);

  if (!show) return null;
  
  return (
    <div className="flex flex-col items-center w-full">
      <Button
        onClick={onClick}
        className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90 py-3 px-6 sm:px-8 mb-4"
        size="lg"
      >
        <span className="text-base whitespace-nowrap">Create event on my own</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
      
      {scriptLoaded && (
        <div className="w-full max-w-md">
          <langflow-chat
            ref={langflowRef}
            window_title="Planning Agent"
            flow_id="92ee8c63-7a3a-4f91-b507-a6f5a49a81d7"
            host_url="https://astra.datastax.com">
          </langflow-chat>
        </div>
      )}
    </div>
  );
};
