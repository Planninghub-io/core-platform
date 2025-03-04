
import { useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const location = useLocation();
  const isBusiness = location.state?.type === 'business';
  
  // This pulls any event data from the location state
  // which will be passed back to the event creation page after auth

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <AuthForm type={isBusiness ? 'business' : 'user'} />
      </div>
    </div>
  );
};

export default Auth;
