
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the auth session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.session) {
          toast({
            title: "Authentication Successful",
            description: "You have been successfully signed in.",
          });
          navigate("/");
        } else {
          // If no session, redirect to auth page
          navigate("/auth");
        }
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Processing Authentication...</h1>
        
        {error ? (
          <div className="rounded-md bg-red-100 p-4 text-red-700">
            {error}
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
