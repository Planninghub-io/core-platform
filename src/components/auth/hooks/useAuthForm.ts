
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  handleUserSignUp as handleSignUp, 
  SignUpData
} from "../utils/signUpUtils";
import {
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
  SignInData
} from "../utils/signInUtils";
import { useEventCreation } from "@/hooks/useEventCreation";

interface UseAuthFormProps {
  type?: 'business' | 'user';
}

export function useAuthForm({ type }: UseAuthFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const isBusiness = type === 'business';
  const location = useLocation();
  const navigate = useNavigate();
  const { createEvent } = useEventCreation();
  
  // Extract redirect information from location state
  const eventData = location.state?.eventData;
  const redirectPath = location.state?.redirectPath || "/";

  // Store redirect path for OAuth flow
  useState(() => {
    if (redirectPath && redirectPath !== '/auth') {
      localStorage.setItem('authRedirectPath', redirectPath);
    }
  });

  const handleRedirect = async () => {
    // For sign up, we don't do any direct redirection as it will be handled
    // in the handleUserSignUp function to go to verification page
    
    // If we have event data, navigate back to create event page with the data
    if (eventData) {
      navigate(redirectPath, { state: { eventData } });
    } else {
      navigate(redirectPath);
    }
  };

  const signUp = async (formData: SignUpData) => {
    setIsLoading(true);
    try {
      // Don't pass handleRedirect here as the redirect is handled internally
      // in the handleUserSignUp function
      await handleSignUp(formData, isBusiness, toast, handleRedirect);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (formData: SignInData) => {
    setIsLoading(true);
    try {
      await handleUserSignIn(formData, toast, handleRedirect);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const success = await handleGoogleSignIn(isBusiness, toast);
      // We don't call handleRedirect here as the OAuth process will handle the redirect
      if (!success) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  
  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const success = await handleAppleSignIn(isBusiness, toast);
      // We don't call handleRedirect here as the OAuth process will handle the redirect
      if (!success) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return {
    isLoading,
    isSignUp,
    isBusiness,
    eventData,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    toggleAuthMode
  };
}
