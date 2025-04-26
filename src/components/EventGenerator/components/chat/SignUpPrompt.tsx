
import { Button } from "@/components/ui/button";
import { Building, UserPlus } from "lucide-react";

interface SignUpPromptProps {
  onSignUpIndividual: () => void;
  onSignUpBusiness: () => void;
}

export const SignUpPrompt = ({ 
  onSignUpIndividual, 
  onSignUpBusiness 
}: SignUpPromptProps) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
      <p className="text-blue-800 mb-4">
        You've used your free event generation. Sign up to continue creating events!
      </p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={onSignUpIndividual}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Sign Up as Individual
        </Button>
        <Button
          onClick={onSignUpBusiness}
          variant="outline"
          className="gap-2 bg-blue-300/40 text-black hover:bg-blue-400/70 border-0"
        >
          <Building className="h-4 w-4" />
          Register as Business
        </Button>
      </div>
    </div>
  );
};
