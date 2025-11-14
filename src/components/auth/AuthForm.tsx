import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { useAuthForm } from "./hooks/useAuthForm";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Apple } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { HelpMenu } from "./components/HelpMenu";

interface AuthFormProps {
  type?: 'business' | 'user';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const {
    isLoading,
    isSignUp,
    isBusiness,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    toggleAuthMode,
    error
  } = useAuthForm({ type });
  
  const [appleButtonDisabled, setAppleButtonDisabled] = useState(false);
  const [googleButtonDisabled, setGoogleButtonDisabled] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleAppleSignIn = async () => {
    setOauthError(null);
    setIsAppleLoading(true);
    try {
      const result = await signInWithApple();
      if (!result.success) {
        if (result.providerDisabled) {
          setAppleButtonDisabled(true);
        }
        setOauthError(result.error || "Failed to sign in with Apple");
      }
    } finally {
      // If the redirect didn't happen, reset loading state
      setTimeout(() => setIsAppleLoading(false), 5000);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthError(null);
    setIsGoogleLoading(true);
    console.log("Google sign-in button clicked");
    
    try {
      const result = await signInWithGoogle();
      console.log("Google sign-in result:", result);
      
      if (!result.success) {
        console.error("Google sign-in failed:", result.error);
        
        if (result.providerDisabled) {
          setGoogleButtonDisabled(true);
          setOauthError("Google sign-in is currently disabled. Please use email and password.");
        } else if (result.configError) {
          setOauthError("Google authentication requires accessing the app from the correct domain. Please try from https://yourplanner.ai or contact support.");
        } else {
          setOauthError(result.error || "Failed to sign in with Google");
        }
        setIsGoogleLoading(false);
      }
      // Note: If successful, the page will redirect to Google OAuth
      // so we don't set loading to false here
    } catch (err) {
      console.error("Error in Google sign-in handler:", err);
      setOauthError("An unexpected error occurred during Google sign-in");
      setIsGoogleLoading(false);
    }
    
    // Fallback: If the redirect didn't happen after 10 seconds, reset loading state
    setTimeout(() => {
      if (isGoogleLoading) {
        console.log("Google OAuth redirect timeout - resetting loading state");
        setIsGoogleLoading(false);
      }
    }, 10000);
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">
        {isSignUp ? `Sign Up${isBusiness ? ' as Business' : ''}` : 'Sign In'}
      </h1>
      
      {oauthError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">{oauthError}</div>
        </Alert>
      )}
      
      {isSignUp ? (
        <SignUpForm
          onSubmit={signUp}
          isLoading={isLoading}
          isBusiness={isBusiness}
          error={error}
        />
      ) : (
        <SignInForm
          onSubmit={signIn}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            disabled={isLoading || isGoogleLoading || googleButtonDisabled}
            title={googleButtonDisabled ? "Google sign-in is not currently enabled" : "Sign in with Google"}
          >
            {isGoogleLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-0 border-current"></span>
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isGoogleLoading ? "Connecting..." : "Google"}
          </Button>
          
          <Button
            type="button"
            onClick={handleAppleSignIn}
            variant="outline"
            className="w-full"
            disabled={isLoading || isAppleLoading || appleButtonDisabled}
            title={appleButtonDisabled ? "Apple sign-in is not currently enabled" : "Sign in with Apple"}
          >
            {isAppleLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-0 border-current"></span>
            ) : (
              <Apple className="mr-2 h-4 w-4" />
            )}
            {isAppleLoading ? "Connecting..." : "Apple"}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <Button
          type="button"
          onClick={toggleAuthMode}
          variant="link"
          className="p-0 text-sm font-normal text-gray-600 hover:text-gray-900"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      <HelpMenu />
    </div>
  );
};

export default AuthForm;
