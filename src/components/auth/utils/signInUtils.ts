
import { handleUserSignIn } from './email-password/emailPasswordAuth';
import { handleGoogleSignIn } from './oauth/googleAuth';
import { handleAppleSignIn } from './oauth/appleAuth';
import type { SignInData, SignInResult } from './types/auth';

export type { SignInData, SignInResult };
export { handleUserSignIn, handleGoogleSignIn, handleAppleSignIn };
