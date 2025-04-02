
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h1>
      <p className="text-center text-gray-600 mb-6">
        We've sent a verification code to {email}
      </p>
      <div className="space-y-6">
        {/* Verification form will be implemented here */}
        <p className="text-center text-sm text-gray-500">
          Please enter the verification code to continue
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
