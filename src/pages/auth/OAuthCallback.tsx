
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("OAuth callback triggered, processing authentication");
        console.log("Current URL:", window.location.href);
        
        // Improved error detection from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        // Check URL parameters for errors
        const errorParam = urlParams.get('error') || hashParams.get('error');
        const errorDescriptionParam = urlParams.get('error_description') || hashParams.get('error_description');
        
        if (errorParam || errorDescriptionParam) {
          const errorMessage = errorDescriptionParam || errorParam || 'Unknown error';
          console.error("OAuth error from URL:", errorMessage);
          setError(errorMessage);
          toast({
            title: "Authentication Error",
            description: errorMessage,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // For OAuth providers like Google, we need to exchange the code for a session
        const code = urlParams.get('code');
        if (code) {
          console.log("Found authorization code, exchanging for session");
          
          // Get the code verifier that was stored during the sign-in initiation
          const codeVerifier = localStorage.getItem('pkce_code_verifier');
          if (!codeVerifier) {
            console.error("No code verifier found");
            setError("Authentication failed: Missing code verifier");
            toast({
              title: "Authentication Error",
              description: "Missing authentication data. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Error exchanging code for session:", error);
            setError(error.message);
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log("Successfully exchanged code for session");
          
          // Clean up the code verifier
          localStorage.removeItem('pkce_code_verifier');
          
          if (data.session) {
            toast({
              title: "Authentication Successful",
              description: "You have been successfully signed in.",
            });
            
            // Check if there's a redirect path stored in localStorage
            const redirectPath = localStorage.getItem('authRedirectPath') || '/';
            localStorage.removeItem('authRedirectPath'); // Clean up
            
            // Delay the navigation slightly to ensure toast is visible
            setTimeout(() => {
              navigate(redirectPath);
            }, 500);
            return;
          }
        }
        
        // If we don't have a code, check if we have a session directly
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log("Session data:", data.session ? "Session exists" : "No session");
        
        if (data.session) {
          toast({
            title: "Authentication Successful",
            description: "You have been successfully signed in.",
          });
          
          // Check if there's a redirect path stored in localStorage
          const redirectPath = localStorage.getItem('authRedirectPath') || '/';
          localStorage.removeItem('authRedirectPath'); // Clean up
          
          // Delay the navigation slightly to ensure toast is visible
          setTimeout(() => {
            navigate(redirectPath);
          }, 500);
        } else {
          // If no session, redirect to auth page
          console.log("No session found, redirecting to auth page");
          navigate("/auth");
        }
      } catch (err: any) {
        console.error("Unexpected error during callback:", err);
        setError(err.message || "An unexpected error occurred");
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Wait a moment before processing the callback to ensure all URL parameters are available
    const timer = setTimeout(handleCallback, 800);
    return () => clearTimeout(timer);
  }, [navigate, toast, location]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Processing Authentication...</h1>
        
        {error ? (
          <div className="rounded-md bg-red-100 p-4 text-red-700">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-2">Please try again or contact support if this issue persists.</p>
            <button 
              onClick={() => navigate('/auth')}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Return to sign in
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-purple-500"></div>
            <p className="mt-4 text-gray-600">Please wait while we sign you in...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
