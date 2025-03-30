
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { checkProfileSetup } from "@/components/auth/utils/authUtils";

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
        
        // If user is authenticated, check if they need to complete profile setup
        if (session?.user && !skipRedirect) {
          const needsProfileSetup = await checkProfileSetup();
          if (needsProfileSetup && location.pathname !== '/profile-setup') {
            navigate('/profile-setup', { replace: true });
          }
        }
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed", event, session?.user ? "user exists" : "no user");
      setUser(session?.user ?? null);
      
      // Check if user needs profile setup after auth state change
      if (session?.user && !skipRedirect) {
        const needsProfileSetup = await checkProfileSetup();
        if (needsProfileSetup && location.pathname !== '/profile-setup') {
          navigate('/profile-setup', { replace: true });
        }
      }
      
      // Handle SIGNED_OUT event explicitly
      if (event === 'SIGNED_OUT' && !skipRedirect && location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true });
      }
      
      setLoading(false);
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
