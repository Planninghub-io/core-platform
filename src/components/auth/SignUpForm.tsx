
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff } from "lucide-react";
import BusinessDetailsForm from "./BusinessDetailsForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SignUpFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    companyName?: string;
    businessPhone?: string;
    role?: string;
  }) => void;
  isLoading: boolean;
  isBusiness: boolean;
}

const SignUpForm = ({ onSubmit, isLoading, isBusiness }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set appropriate role based on account type
    const selectedRole = accountType === "company" ? "business_admin" : "user";
    
    onSubmit({
      email,
      password,
      companyName: accountType === "company" ? companyName : undefined,
      businessPhone: accountType === "company" ? businessPhone : undefined,
      role: selectedRole
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <RadioGroup 
          value={accountType} 
          onValueChange={setAccountType}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company">Company</Label>
          </div>
        </RadioGroup>
      </div>

      {accountType === "company" && (
        <BusinessDetailsForm
          companyName={companyName}
          businessEmail={email}  
          businessPhone={businessPhone}
          onCompanyNameChange={setCompanyName}
          onBusinessEmailChange={() => {}} // Email is already captured above
          onBusinessPhoneChange={setBusinessPhone}
        />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (min. 6 characters)"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </button>
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Loading...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;
