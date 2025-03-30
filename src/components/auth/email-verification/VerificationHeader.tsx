
import { Mail, CheckCircle } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { VerificationStatus } from "./useEmailVerification";

type VerificationHeaderProps = {
  status: VerificationStatus;
  email: string | null;
};

export const VerificationHeader = ({ status, email }: VerificationHeaderProps) => {
  return (
    <>
      <CardTitle className="text-center">
        {status === 'success' ? (
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Mail className="h-16 w-16 text-blue-500" />
          </div>
        )}
      </CardTitle>
      <CardTitle className="text-center mt-4">
        {status === 'success' 
          ? 'Email Verified!' 
          : status === 'error' 
            ? 'Verification Failed' 
            : status === 'verifying'
              ? 'Verifying...'
              : 'Verify Your Email'}
      </CardTitle>
      <CardDescription className="text-center">
        {status === 'success' 
          ? 'Your email has been successfully verified. You will be redirected shortly.' 
          : status === 'error'
            ? 'We were unable to verify your email. The code may be invalid or expired.'
            : status === 'verifying'
              ? 'Please wait while we verify your email...'
              : `We've sent a verification code to ${email || 'your email'}. Please enter the 5-digit code below to verify your account.`}
      </CardDescription>
    </>
  );
};
