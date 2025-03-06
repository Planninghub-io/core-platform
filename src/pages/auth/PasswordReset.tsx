
import PasswordResetRequestForm from "@/components/auth/PasswordResetRequestForm";

const PasswordReset = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md">
        <PasswordResetRequestForm />
      </div>
    </div>
  );
};

export default PasswordReset;
