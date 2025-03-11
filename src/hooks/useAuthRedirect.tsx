
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UseAuthRedirectProps {
  redirectPath?: string;
  skipRedirect?: boolean;
}

export const useAuthRedirect = ({
  redirectPath = "/auth",
  skipRedirect = false
}: UseAuthRedirectProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth check: Session", session?.user ? "user exists" : "no user");
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed", event, session?.user ? "user exists" : "no user");
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Handle SIGNED_OUT event explicitly
      if (event === 'SIGNED_OUT' && !skipRedirect && location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectPath, skipRedirect, location.pathname]);

  // Redirect if no user and not loading
  useEffect(() => {
    if (!user && !loading && !skipRedirect && location.pathname !== redirectPath) {
      console.log("Redirecting to auth page from", location.pathname);
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate, redirectPath, skipRedirect, location.pathname]);

  return { user, loading };
};
