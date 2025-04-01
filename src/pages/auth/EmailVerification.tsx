
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEmailVerification, VerificationForm, VerificationHeader, VerificationFooter } from "@/components/auth/email-verification";

export default function EmailVerification() {
  const { 
    status, 
    email, 
    isResending, 
    handleCodeVerification, 
    resendVerification 
  } = useEmailVerification();

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <VerificationHeader status={status} email={email} />
        </CardHeader>
        
        <CardContent>
          {status === 'waiting' && (
            <VerificationForm onSubmit={handleCodeVerification} isSubmitting={status === 'verifying'} />
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <VerificationFooter 
            status={status} 
            email={email} 
            onResendVerification={resendVerification}
            isResending={isResending}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
