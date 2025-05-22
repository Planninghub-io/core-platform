
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

interface SignInFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
  }) => void;
  isLoading: boolean;
  error?: string | null;
}

declare global {
  interface Window {
    turnstile?: any;
  }
}

const SignInForm = ({ onSubmit, isLoading, error }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  
  // Load Turnstile script on component mount
  useEffect(() => {
    const loadTurnstile = () => {
      if (typeof window !== 'undefined' && !document.getElementById('turnstile-script')) {
        const script = document.createElement('script');
        script.id = 'turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setTurnstileLoaded(true);
          console.log("Turnstile script loaded");
        };
        
        document.head.appendChild(script);
      } else if (typeof window !== 'undefined' && window.turnstile) {
        setTurnstileLoaded(true);
      }
    };
    
    loadTurnstile();
    
    return () => {
      // Clean up if component unmounts
      if (typeof window !== 'undefined' && window.turnstile) {
        try {
          window.turnstile.reset();
        } catch (e) {
          console.error("Failed to reset turnstile on unmount", e);
        }
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset Turnstile before submitting
    if (typeof window !== 'undefined' && window.turnstile) {
      try {
        window.turnstile.reset();
      } catch (e) {
        console.error("Failed to reset turnstile before submission", e);
      }
    }
    
    onSubmit({
      email,
      password
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-9"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </button>
        </div>
        <div className="text-right mt-1">
          <Button
            variant="link"
            className="p-0 text-xs font-normal text-gray-600 hover:text-gray-900"
            asChild
          >
            <Link to="/auth/password-reset">Forgot password?</Link>
          </Button>
        </div>
      </div>
      
      {/* Hidden container for Turnstile */}
      <div id="cf-turnstile" className="mt-4"></div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default SignInForm;
