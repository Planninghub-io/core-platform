
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("EventsHub: Auth effect running");
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("EventsHub: Got session", session?.user ? "user exists" : "no user");
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("EventsHub: Auth state changed", session?.user ? "user exists" : "no user");
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if no user
  useEffect(() => {
    if (!user && !loading) {
      console.log("EventsHub: Redirecting to auth page");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  return { user, loading };
};
