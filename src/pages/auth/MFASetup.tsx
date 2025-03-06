
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { setupMFA, verifyMFA } from "@/components/auth/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const MFASetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [factorType, setFactorType] = useState<'email' | 'totp'>('email');
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [enrollData, setEnrollData] = useState<any>(null);

  const handleSetupMFA = async () => {
    setIsLoading(true);
    try {
      // Get current user's email if not provided
      if (!email) {
        const { data } = await supabase.auth.getUser();
        if (data.user?.email) {
          setEmail(data.user.email);
        } else {
          toast({
            title: "Error",
            description: "Email is required for MFA setup",
            variant: "destructive",
          });
          return;
        }
      }
      
      const result = await setupMFA(factorType, email, undefined, toast);
      if (result) {
        setEnrollData(result);
        setStep('verify');
        toast({
          title: "Verification Required",
          description: "Please check your email for a verification code.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!enrollData || !verificationCode) {
      toast({
        title: "Error",
        description: "Verification code is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyMFA(
        enrollData.id,
        enrollData.challenge.id,
        verificationCode,
        toast,
        () => navigate("/settings/profile")
      );
      
      if (success) {
        toast({
          title: "Success",
          description: "MFA has been successfully set up for your account.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Set up an additional layer of security for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'setup' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="factor-type">Authentication Method</Label>
              <RadioGroup 
                id="factor-type"
                value={factorType} 
                onValueChange={(value: 'email' | 'totp') => setFactorType(value)}
              >
                <div className="flex items-center space-x-2">
                  <Radio value="email" id="email" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio value="totp" id="totp" disabled />
                  <Label htmlFor="totp">Authenticator App (Coming Soon)</Label>
                </div>
              </RadioGroup>
            </div>
            
            {factorType === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="email-input">Email Address</Label>
                <Input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the verification code"
            />
            <p className="text-sm text-gray-500">
              Enter the verification code sent to your email.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => step === 'setup' ? navigate(-1) : setStep('setup')}
          disabled={isLoading}
        >
          {step === 'setup' ? 'Cancel' : 'Back'}
        </Button>
        <Button 
          onClick={step === 'setup' ? handleSetupMFA : handleVerifyMFA}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : step === 'setup' ? 'Set Up MFA' : 'Verify'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MFASetup;
