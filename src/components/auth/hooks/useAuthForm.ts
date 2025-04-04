
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
} from "../utils/authUtils";

interface UseAuthFormProps {
  type?: 'business' | 'user';
}

export const useAuthForm = ({ type = 'user' }: UseAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isBusiness = type === 'business';

  const signUp = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await handleUserSignUp(
        data,
        isBusiness,
        toast,
        () => navigate('/')
      );

      if (!result.success) {
        setError(result.error || "Failed to sign up");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      console.error("Signup error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await handleUserSignIn(
        data,
        toast,
        () => navigate('/')
      );

      if (!result.success) {
        setError(result.error || "Failed to sign in");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      console.error("Signin error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      await handleGoogleSignIn(toast);
      // No need to handle navigation here as it's handled by OAuth redirect
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      console.error("Google signin error:", err.message);
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      await handleAppleSignIn(toast);
      // No need to handle navigation here as it's handled by OAuth redirect
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Apple");
      console.error("Apple signin error:", err.message);
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null); // Reset error when toggling between sign in and sign up
  };

  return {
    isLoading,
    isSignUp,
    isBusiness,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    toggleAuthMode,
  };
};
