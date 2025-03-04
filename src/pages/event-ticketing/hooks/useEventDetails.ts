
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useEventDetails = (eventId: string | undefined) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventDetails = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error",
          description: "Failed to load event information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  return { event, loading };
};
