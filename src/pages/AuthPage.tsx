
import React from 'react';
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
  const location = useLocation();
  const redirectPath = location.state?.redirectPath || '/';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to sign in or create an account
      </p>
      {/* Auth form will be implemented here */}
    </div>
  );
};

export default AuthPage;
