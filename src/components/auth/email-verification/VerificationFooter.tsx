
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VerificationStatus } from "./useEmailVerification";

type VerificationFooterProps = {
  status: VerificationStatus;
  email: string | null;
  onResendVerification: () => Promise<void>;
};

export const VerificationFooter = ({ status, email, onResendVerification }: VerificationFooterProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      {status === 'success' ? (
        <Button onClick={() => navigate('/')}>
          Continue to Home
        </Button>
      ) : status === 'error' ? (
        <div className="flex flex-col gap-2 w-full">
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Return to Sign In
          </Button>
          {email && (
            <Button onClick={onResendVerification}>
              Resend Verification
            </Button>
          )}
        </div>
      ) : status === 'waiting' ? (
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={onResendVerification} disabled={!email}>
            Resend Code
          </Button>
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Return to Sign In
          </Button>
        </div>
      ) : null}
    </>
  );
};
