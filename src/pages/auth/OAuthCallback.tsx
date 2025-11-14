
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, APP_URL } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("OAuth callback triggered, processing authentication");
        console.log("Current URL:", window.location.href);
        console.log("App URL to use for redirects:", APP_URL);
        
        // Get code and error parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescriptionParam = urlParams.get('error_description');
        
        // Collect debug info
        const callbackDebugInfo = {
          url: window.location.href,
          code: code ? "present" : "missing",
          error: errorParam,
          errorDescription: errorDescriptionParam,
          hasLocalStorage: typeof localStorage !== 'undefined',
          savedRedirectPath: localStorage.getItem('authRedirectPath')
        };
        setDebugInfo(callbackDebugInfo);
        console.log("Debug info:", callbackDebugInfo);
        
        // Handle error parameters first
        if (errorParam || errorDescriptionParam) {
          const errorMessage = errorDescriptionParam || errorParam || 'Unknown error';
          console.error("OAuth error from URL:", errorMessage);
          setError(errorMessage);
          
          // Handle specific Google OAuth errors
          if (errorMessage.includes('access_denied')) {
            toast({
              title: "Authentication Cancelled",
              description: "You cancelled the Google sign-in process. Please try again if you want to sign in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Authentication Error",
              description: errorMessage,
              variant: "destructive",
            });
          }
          setLoading(false);
          
          // Redirect to auth page after a delay
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
          return;
        }
        
        if (code) {
          console.log("Found authorization code, exchanging for session");
          
          try {
            // Wait a moment to ensure browser state is updated
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error("Error exchanging code for session:", error);
              setError(error.message);
              toast({
                title: "Authentication Error",
                description: `Failed to complete sign-in: ${error.message}`,
                variant: "destructive",
              });
              setLoading(false);
              
              // Redirect to auth page after a delay
              setTimeout(() => {
                navigate('/auth', { replace: true });
              }, 3000);
              return;
            }
            
            console.log("Successfully exchanged code for session:", data);
            
            if (data.session && data.user) {
              console.log("User authenticated successfully:", data.user.email);
              
              toast({
                title: "Welcome!",
                description: `Successfully signed in with Google as ${data.user.email}`,
              });
              
              // Get redirect path from localStorage or default to home
              const redirectPath = localStorage.getItem('authRedirectPath') || '/';
              localStorage.removeItem('authRedirectPath'); // Clean up
              
              console.log("Redirecting to:", redirectPath);
              
              // Small delay to ensure toast is shown
              setTimeout(() => {
                navigate(redirectPath, { replace: true });
              }, 1000);
            } else {
              console.error("No session or user returned after code exchange");
              setError("Failed to retrieve user session");
              toast({
                title: "Authentication Error",
                description: "Failed to retrieve user information. Please try again.",
                variant: "destructive",
              });
              setLoading(false);
              
              setTimeout(() => {
                navigate('/auth', { replace: true });
              }, 3000);
            }
          } catch (exchangeError: any) {
            console.error("Error during code exchange:", exchangeError);
            setError(exchangeError.message || "Failed to process authentication");
            toast({
              title: "Authentication Error",
              description: "Failed to process Google authentication. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            
            setTimeout(() => {
              navigate('/auth', { replace: true });
            }, 3000);
          }
        } else {
          console.log("No code found in URL, checking for existing session");
          
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
              title: "Welcome back!",
              description: "You are already signed in.",
            });
            
            const redirectPath = localStorage.getItem('authRedirectPath') || '/';
            localStorage.removeItem('authRedirectPath');
            
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1000);
          } else {
            console.log("No session found and no code parameter, redirecting to auth page");
            setError("No authentication data found");
            toast({
              title: "Authentication Required",
              description: "Please sign in to continue.",
              variant: "destructive",
            });
            
            setTimeout(() => {
              navigate("/auth", { replace: true });
            }, 2000);
          }
        }
      } catch (err: any) {
        console.error("Unexpected error during callback:", err);
        setError(err.message || "An unexpected error occurred");
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, toast, location]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">Processing Authentication...</h1>
        
        {error ? (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-2 text-sm">Redirecting you back to sign in...</p>
            {debugInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
                <pre className="mt-2 overflow-auto bg-gray-100 p-2 text-xs text-gray-800 rounded">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
            <button 
              onClick={() => navigate('/auth')}
              className="mt-4 w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-purple-500"></div>
            <p className="mt-4 text-gray-600 text-center">Please wait while we sign you in with Google...</p>
            <p className="mt-2 text-sm text-gray-500 text-center">This may take a few moments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
