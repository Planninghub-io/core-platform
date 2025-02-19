
import { useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const location = useLocation();
  const isBusiness = location.state?.type === 'business';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <AuthForm type={isBusiness ? 'business' : 'user'} />
      </div>
    </div>
  );
};

export default Auth;
