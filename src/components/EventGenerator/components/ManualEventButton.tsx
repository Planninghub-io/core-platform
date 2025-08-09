
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface ManualEventButtonProps {
  show: boolean;
  onClick: () => void;
}

export const ManualEventButton = ({ show, onClick }: ManualEventButtonProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (show && !document.querySelector('script[src*="langflow-embedded-chat"]')) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js";
      script.async = true;
      
      script.onload = () => {
        console.log("Langflow script loaded successfully");
      };
      
      script.onerror = () => {
        console.error("Error loading Langflow script");
      };
      
      document.head.appendChild(script);
      scriptRef.current = script;
    }
    
    return () => {
      if (scriptRef.current && !show) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [show]);

  if (!show) return null;
  
  return (
    <>
      {/* Button centered */}
      <div className="flex justify-center w-full">
        <Button
          onClick={onClick}
          className="animate-fade-up gap-2 bg-[#9b87f5] hover:bg-[#9b87f5]/90 py-3 px-6 sm:px-8"
          size="lg"
        >
          <span className="text-base whitespace-nowrap">Create event on my own</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Planning Agent positioned at bottom right corner with proper spacing */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <langflow-chat
          ref={chatRef}
          window_title="Planning Agent"
          flow_id="92ee8c63-7a3a-4f91-b507-a6f5a49a81d7"
          host_url="https://astra.datastax.com">
        </langflow-chat>
      </div>
    </>
  );
};
