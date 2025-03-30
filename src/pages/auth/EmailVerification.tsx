
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { VerificationForm } from "@/components/auth/email-verification/VerificationForm";
import { VerificationHeader } from "@/components/auth/email-verification/VerificationHeader";
import { VerificationFooter } from "@/components/auth/email-verification/VerificationFooter";
import { useEmailVerification, VerificationStatus } from "@/components/auth/email-verification/useEmailVerification";

const EmailVerification = () => {
  const { status, email, handleCodeVerification, resendVerification } = useEmailVerification();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <VerificationHeader status={status} email={email} />
        </CardHeader>
        <CardContent>
          {(status === 'waiting' || status === 'verifying') && email && (
            <VerificationForm 
              onSubmit={handleCodeVerification} 
              isSubmitting={status === 'verifying'} 
            />
          )}
          
          {status === 'waiting' && !email && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Looking for your account information...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <VerificationFooter 
            status={status} 
            email={email} 
            onResendVerification={resendVerification} 
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;
