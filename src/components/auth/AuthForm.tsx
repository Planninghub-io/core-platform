
import { Button } from "@/components/ui/button";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { useAuthForm } from "./hooks/useAuthForm";

interface AuthFormProps {
  type?: 'business' | 'user';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const {
    isLoading,
    isSignUp,
    isBusiness,
    signUp,
    signIn,
    toggleAuthMode
  } = useAuthForm({ type });

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">
        {isSignUp ? `Sign Up${isBusiness ? ' as Business' : ''}` : 'Sign In'}
      </h1>
      {isSignUp ? (
        <SignUpForm
          onSubmit={signUp}
          isLoading={isLoading}
          isBusiness={isBusiness}
        />
      ) : (
        <SignInForm
          onSubmit={signIn}
          isLoading={isLoading}
        />
      )}
      <Button
        type="button"
        onClick={toggleAuthMode}
        variant="outline"
        className="w-full mt-4"
      >
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Button>
    </div>
  );
};

export default AuthForm;
