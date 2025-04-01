
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChecklistRequest {
  eventId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json() as ChecklistRequest;
    
    if (!eventId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameter: eventId" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Generate a basic checklist based on event type
    // In a real implementation, this would be more sophisticated
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      throw eventError;
    }
    
    if (!eventData) {
      return new Response(
        JSON.stringify({ 
          error: "Event not found" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Generate a simple checklist based on event details
    const eventType = eventData.event_type || 'general';
    const checklist = generateChecklist(eventType, eventData);
    
    console.log(`Generated checklist for event: ${eventId}, type: ${eventType}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        checklist
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in checklist function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to generate checklist items
function generateChecklist(eventType: string, eventData: any) {
  const daysUntilEvent = calculateDaysUntilEvent(eventData.date);
  
  // Basic checklist structure
  const checklist = {
    sections: [
      {
        title: "Planning",
        items: [
          { title: "Confirm event details", timeline: "ASAP", completed: false },
          { title: "Create budget", timeline: "ASAP", completed: false },
          { title: "Book venue", timeline: "At least 2 months before", completed: false }
        ]
      },
      {
        title: "Pre-Event",
        items: [
          { title: "Send invitations", timeline: "1 month before", completed: false },
          { title: "Confirm attendance", timeline: "2 weeks before", completed: false },
          { title: "Final vendor confirmations", timeline: "1 week before", completed: false }
        ]
      },
      {
        title: "Day of Event",
        items: [
          { title: "Arrive early for setup", timeline: "Day of event", completed: false },
          { title: "Check all equipment", timeline: "Day of event", completed: false },
          { title: "Welcome guests", timeline: "Day of event", completed: false }
        ]
      }
    ],
    eventId: eventData.id,
    lastUpdated: new Date().toISOString()
  };
  
  // Add event-specific items based on event type
  if (eventType === 'wedding') {
    checklist.sections[0].items.push({ title: "Book photographer", timeline: "3 months before", completed: false });
    checklist.sections[0].items.push({ title: "Order cake", timeline: "2 months before", completed: false });
  } else if (eventType === 'conference') {
    checklist.sections[0].items.push({ title: "Book speakers", timeline: "3 months before", completed: false });
    checklist.sections[0].items.push({ title: "Prepare agenda", timeline: "1 month before", completed: false });
  }
  
  return checklist;
}

// Helper function to calculate days until event
function calculateDaysUntilEvent(eventDate: string): number {
  if (!eventDate) return 30; // Default to 30 days if no date
  
  const now = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}
