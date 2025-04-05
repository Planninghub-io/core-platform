
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  const location = useLocation();
  const redirectPath = location.state?.redirectPath || '/';
  const type = location.state?.type || 'user';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to sign in or create an account
      </p>
      <AuthForm type={type} />
    </div>
  );
};

export default AuthPage;
