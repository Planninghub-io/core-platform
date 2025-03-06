
// This file re-exports all auth utilities for backward compatibility
import { SignUpData, handleUserSignUp } from './signUpUtils';
import { SignInData, handleUserSignIn, handleGoogleSignIn } from './signInUtils';
import { setupMFA, verifyMFA } from './mfaUtils';
import { verifyOTP, sendPasswordResetOTP } from './otpUtils';

// Re-export everything for backward compatibility
export {
  SignUpData,
  SignInData,
  handleUserSignUp,
  handleUserSignIn,
  handleGoogleSignIn,
  setupMFA,
  verifyMFA,
  verifyOTP,
  sendPasswordResetOTP
};
