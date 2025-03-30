
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';

const MFAChallenge = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getMFAData = async () => {
      try {
        // Get current MFA factors
        const { data: { factors }, error: factorError } = await supabase.auth.mfa.listFactors();
        
        if (factorError) {
          throw factorError;
        }
        
        if (!factors || factors.length === 0) {
          // No MFA set up
          toast({
            title: "No MFA Setup",
            description: "You don't have MFA enabled. Redirecting to home.",
          });
          navigate('/');
          return;
        }
        
        // Get the first verified factor
        const verifiedFactor = factors.find(factor => factor.status === 'verified');
        
        if (!verifiedFactor) {
          toast({
            title: "No Verified MFA",
            description: "You don't have any verified MFA factors.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setFactorId(verifiedFactor.id);
        
        // Create a challenge
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: verifiedFactor.id,
        });
        
        if (challengeError) {
          throw challengeError;
        }
        
        setChallengeId(challenge.id);
      } catch (error: any) {
        console.error("MFA setup error:", error);
        toast({
          title: "MFA Error",
          description: error.message || "An error occurred during MFA setup",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };
    
    getMFAData();
  }, [navigate, toast]);

  const handleVerify = async () => {
    if (!factorId || !challengeId || !code || code.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification Successful",
        description: "You have been successfully authenticated",
      });
      
      // Redirect to home or previous page
      const redirectPath = localStorage.getItem('authRedirectPath') || '/';
      localStorage.removeItem('authRedirectPath'); // Clean up
      navigate(redirectPath);
    } catch (error: any) {
      console.error("MFA verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-4">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify}
            disabled={isLoading || code.length < 6}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MFAChallenge;
