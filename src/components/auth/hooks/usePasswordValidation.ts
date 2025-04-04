
import { useState, useEffect } from "react";

interface PasswordValidations {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  passwordsMatch: boolean;
}

export const usePasswordValidation = (password: string, confirmPassword: string) => {
  const [validations, setValidations] = useState<PasswordValidations>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    const validationResults = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      passwordsMatch: password === confirmPassword && password !== ""
    };
    
    setValidations(validationResults);
    
    const isValid = Object.values(validationResults).every(value => value === true);
    setIsFormValid(isValid);
  }, [password, confirmPassword]);
  
  return { validations, isFormValid };
};
