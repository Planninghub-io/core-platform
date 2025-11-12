
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const { invitationId } = await req.json();

    // Fetch invitation details and verify user owns the event
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select(`
        *,
        event:events(
          title,
          description,
          date,
          location,
          user_id
        ),
        template:invitation_templates(
          template_html
        ),
        recipients:invitation_recipients(
          delivery_method,
          contact:contacts(
            name,
            email,
            phone
          )
        )
      `)
      .eq("id", invitationId)
      .single();

    if (invitationError) throw invitationError;

    // Verify user owns the event
    if (invitation.event.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: You do not own this event' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    // Process each recipient
    for (const recipient of invitation.recipients) {
      try {
        if (recipient.delivery_method === "email" && recipient.contact.email) {
          // Send email using Resend
          await resend.emails.send({
            from: "events@yourdomain.com",
            to: recipient.contact.email,
            subject: `You're invited to ${invitation.event.title}`,
            html: invitation.template.template_html
              .replace("{{event_title}}", invitation.event.title)
              .replace("{{event_description}}", invitation.event.description)
              .replace("{{event_date}}", new Date(invitation.event.date).toLocaleString())
              .replace("{{event_location}}", invitation.event.location)
              .replace("{{recipient_name}}", recipient.contact.name),
          });
        } else if (recipient.delivery_method === "sms" && recipient.contact.phone) {
          // SMS implementation would go here
          // This is just a placeholder since actual SMS sending would require an SMS provider
          console.log(`Sending SMS to ${recipient.contact.phone} for ${recipient.contact.name}`);
          
          // Uncomment and customize when implementing with a real SMS provider:
          // const smsResponse = await fetch('YOUR_SMS_PROVIDER_URL', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     to: recipient.contact.phone,
          //     message: `Hi ${recipient.contact.name}, you're invited to ${invitation.event.title} on ${new Date(invitation.event.date).toLocaleString()} at ${invitation.event.location}`
          //   })
          // });
        }

        // Update recipient status
        await supabase
          .from("invitation_recipients")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("invitation_id", invitationId)
          .eq("contact_id", recipient.contact.id);
      } catch (error) {
        console.error("Error sending invitation to recipient:", error);
      }
    }

    // Update invitation status
    await supabase
      .from("invitations")
      .update({ status: "sent" })
      .eq("id", invitationId);

    return new Response(
      JSON.stringify({ message: "Invitations sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-invitations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
