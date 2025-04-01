
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client using the JWT from the authorization header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Parse request body if this is a DELETE request (for admin deletion)
    if (req.method === 'DELETE') {
      const { targetEmail, targetUserId } = await req.json();
      
      // Check if the current user is a super admin
      const { data: isSuperAdmin, error: adminCheckError } = await supabaseClient.rpc('is_super_admin');
      
      if (adminCheckError || !isSuperAdmin) {
        return new Response(
          JSON.stringify({ error: 'Access denied: Only super admins can delete users' }),
          {
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      // Delete user based on the provided identifier
      let result;
      
      if (targetEmail) {
        result = await supabaseClient.rpc('admin_delete_user_by_email', { target_email: targetEmail });
      } else if (targetUserId) {
        result = await supabaseClient.rpc('admin_delete_user_by_id', { target_user_id: targetUserId });
      } else {
        return new Response(
          JSON.stringify({ error: 'Either email or user ID must be provided' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      if (result.error) {
        console.error('Error deleting user:', result.error);
        return new Response(
          JSON.stringify({ error: result.error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      // Return success response
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // Return error for unsupported methods
    return new Response(
      JSON.stringify({ error: 'Method not supported' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
