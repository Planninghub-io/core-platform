
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  handleUserSignUp, 
  handleUserSignIn, 
  handleGoogleSignIn, 
  SignUpData, 
  SignInData 
} from "../utils/authUtils";
import { useEventCreation } from "@/hooks/useEventCreation";

interface UseAuthFormProps {
  type?: 'business' | 'user';
}

export const useAuthForm = ({ type }: UseAuthFormProps) => {
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

  const handleRedirect = async () => {
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
      await handleUserSignUp(formData, isBusiness, toast, handleRedirect);
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
      await handleGoogleSignIn(isBusiness, toast, handleRedirect);
    } finally {
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
    toggleAuthMode
  };
};
