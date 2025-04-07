
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
        
        // Get code and error parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescriptionParam = urlParams.get('error_description');
        
        // Handle error parameters first
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
        
        if (code) {
          console.log("Found authorization code, exchanging for session");
          
          try {
            // Wait a moment to ensure browser state is updated (helps with race conditions)
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Exchange the code for a session with better error handling
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
            
            console.log("Successfully exchanged code for session:", data);
            
            if (data.session) {
              toast({
                title: "Authentication Successful",
                description: "You have been successfully signed in.",
              });
              
              // Get redirect path from localStorage or default to home
              const redirectPath = localStorage.getItem('authRedirectPath') || '/';
              localStorage.removeItem('authRedirectPath'); // Clean up
              
              // Delay redirect to ensure toast is shown
              setTimeout(() => {
                navigate(redirectPath, { replace: true });
              }, 500);
            } else {
              console.error("No session returned after code exchange");
              setError("Failed to retrieve session");
              toast({
                title: "Authentication Error",
                description: "Failed to retrieve session. Please try again.",
                variant: "destructive",
              });
              setLoading(false);
            }
          } catch (exchangeError: any) {
            console.error("Error during code exchange:", exchangeError);
            setError(exchangeError.message || "Failed to process authentication");
            toast({
              title: "Authentication Error",
              description: "Failed to process authentication. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
          }
        } else {
          console.error("No code found in URL");
          // Check if we already have a session
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
          
          if (data.session) {
            toast({
              title: "Authentication Successful",
              description: "You have been successfully signed in.",
            });
            
            const redirectPath = localStorage.getItem('authRedirectPath') || '/';
            localStorage.removeItem('authRedirectPath');
            
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 500);
          } else {
            console.log("No session found and no code parameter, redirecting to auth page");
            navigate("/auth");
          }
        }
      } catch (err: any) {
        console.error("Unexpected error during callback:", err);
        setError(err.message || "An unexpected error occurred");
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    handleCallback();
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
