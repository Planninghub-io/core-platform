
export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  error: string | null;
  providerDisabled?: boolean;
}
