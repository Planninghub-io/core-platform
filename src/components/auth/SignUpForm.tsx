
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
  }) => void;
  isLoading: boolean;
  isBusiness: boolean;
  error?: string | null;
}

const SignUpForm = ({ onSubmit, isLoading, isBusiness, error }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileLoaded = useRef(false);

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
          turnstileLoaded.current = true;
          console.log("Turnstile script loaded");
          renderTurnstile();
        };
        
        document.head.appendChild(script);
      } else if (typeof window !== 'undefined' && window.turnstile) {
        turnstileLoaded.current = true;
        renderTurnstile();
      }
    };
    
    loadTurnstile();
    
    return () => {
      // Clean up Turnstile widget when component unmounts
      cleanupTurnstile();
    };
  }, []);

  const renderTurnstile = () => {
    // Only render if the script is loaded and window.turnstile exists
    if (typeof window !== 'undefined' && window.turnstile && turnstileLoaded.current) {
      try {
        // First clean up any existing widgets
        cleanupTurnstile();
        
        // Get the container element
        const captchaContainer = document.getElementById('cf-turnstile');
        if (!captchaContainer) {
          console.error("Turnstile container not found");
          return;
        }
        
        // Make sure the container is empty
        captchaContainer.innerHTML = '';
        
        console.log("Rendering new Turnstile widget");
        
        // Render a new widget
        turnstileWidgetId.current = window.turnstile.render('#cf-turnstile', {
          sitekey: '0x4AAAAAAAEGsBbr9CuGHcR1', // Default Turnstile site key for Supabase
          theme: 'light',
          callback: function(token: string) {
            console.log("Turnstile token received");
          }
        });
        
        console.log("Turnstile widget ID:", turnstileWidgetId.current);
      } catch (e) {
        console.error("Error rendering Turnstile widget:", e);
      }
    }
  };

  const cleanupTurnstile = () => {
    if (typeof window !== 'undefined' && window.turnstile) {
      try {
        // Only remove if we have a widget ID
        if (turnstileWidgetId.current) {
          console.log("Removing Turnstile widget:", turnstileWidgetId.current);
          window.turnstile.remove(turnstileWidgetId.current);
          turnstileWidgetId.current = null;
        }
      } catch (e) {
        console.error("Error cleaning up Turnstile widget:", e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
            placeholder="Enter your password (min. 6 characters)"
            required
            minLength={6}
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
      </div>
      
      {/* Hidden container for Turnstile */}
      <div id="cf-turnstile" className="mt-4"></div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Loading...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;
