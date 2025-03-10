
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed", session?.user ? "user exists" : "no user");
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if no user and not loading
  useEffect(() => {
    if (!user && !loading && !skipRedirect) {
      console.log("Redirecting to auth page");
      navigate(redirectPath);
    }
  }, [user, loading, navigate, redirectPath, skipRedirect]);

  return { user, loading };
};
