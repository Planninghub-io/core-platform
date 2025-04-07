
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleGoogleSignIn,
  handleAppleSignIn,
  SignInResult
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

  const signInWithGoogle = async (): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await handleGoogleSignIn(toast);
      if (!result.success) {
        setError(result.error || "Failed to sign in with Google");
      }
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      console.error("Google signin error:", err.message);
      setIsLoading(false);
      return { success: false, error: err.message || "Failed to sign in with Google" };
    }
  };

  const signInWithApple = async (): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await handleAppleSignIn(toast);
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Apple");
      console.error("Apple signin error:", err.message);
      setIsLoading(false);
      return { success: false, error: err.message || "Failed to sign in with Apple" };
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
