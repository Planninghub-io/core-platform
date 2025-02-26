
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitationId } = await req.json();

    // Fetch invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select(`
        *,
        event:events(
          title,
          description,
          date,
          location
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
          // Implement SMS sending logic here
          console.log("SMS sending would happen here");
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
