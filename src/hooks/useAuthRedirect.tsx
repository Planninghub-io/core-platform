
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
  // Only create these hooks if we're in a component within a Router context
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
          // Check if email is verified
          console.log("Checking email verification status");
          const emailVerified = session.user.user_metadata.email_verified === true;
          
          // Check if we're already on the verification page to avoid redirect loops
          const isOnVerificationPage = location.pathname === '/auth/email-verification';
          console.log("Is on verification page:", isOnVerificationPage);
          console.log("Email verified:", emailVerified);
          
          // If email is not verified and we're not already on the verification page, redirect
          if (!emailVerified && !isOnVerificationPage) {
            console.log("Email not verified, redirecting to verification page");
            const email = session.user.email;
            navigate(`/auth/email-verification?email=${encodeURIComponent(email || '')}`, { replace: true });
            setLoading(false);
            return;
          }
          
          // Don't check profile setup if we're on the verification page
          if (isOnVerificationPage) {
            setLoading(false);
            return;
          }
          
          // Only check profile setup if email is verified
          if (emailVerified) {
            console.log("Email verified, checking profile setup");
            const needsProfileSetup = await checkProfileSetup();
            if (needsProfileSetup && location.pathname !== '/profile-setup') {
              console.log("Profile setup needed, redirecting");
              navigate('/profile-setup', { replace: true });
            }
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
      
      // Skip verification checks if we're already on the verification page
      if (location.pathname === '/auth/email-verification') {
        console.log("Already on verification page, skipping checks");
        return;
      }
      
      // Check if email is verified for new user session
      if (session?.user && !skipRedirect) {
        console.log("Checking email verification after auth state change");
        const emailVerified = session.user.user_metadata.email_verified === true;
        
        // If email is not verified, redirect to verification page
        if (!emailVerified) {
          console.log("Email not verified after auth change, redirecting");
          const email = session.user.email;
          navigate(`/auth/email-verification?email=${encodeURIComponent(email || '')}`, { replace: true });
          return;
        }
        
        // Only check profile setup if email is verified
        if (emailVerified) {
          console.log("Email verified, checking profile setup");
          // Check if user needs profile setup after auth state change
          const needsProfileSetup = await checkProfileSetup();
          if (needsProfileSetup && location.pathname !== '/profile-setup') {
            console.log("Profile setup needed, redirecting");
            navigate('/profile-setup', { replace: true });
          }
        }
      }
      
      // Handle SIGNED_OUT event explicitly
      if (event === 'SIGNED_OUT' && !skipRedirect && location.pathname !== redirectPath) {
        console.log("User signed out, redirecting to auth page");
        navigate(redirectPath, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectPath, skipRedirect, location.pathname]);

  // Redirect if no user and not loading
  useEffect(() => {
    // Skip redirect logic if we're on the email verification page
    if (location.pathname === '/auth/email-verification') {
      console.log("On verification page, skipping redirect");
      return;
    }
    
    if (!user && !loading && !skipRedirect && location.pathname !== redirectPath) {
      console.log("No user, not loading, redirecting to auth page from", location.pathname);
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate, redirectPath, skipRedirect, location.pathname]);

  return { user, loading };
};
