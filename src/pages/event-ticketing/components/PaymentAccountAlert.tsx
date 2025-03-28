
import React from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentAccountAlertProps {
  onSetupAccount: () => void;
}

export const PaymentAccountAlert: React.FC<PaymentAccountAlertProps> = ({ 
  onSetupAccount 
}) => {
  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <CreditCard className="h-4 w-4 text-orange-500" />
      <AlertTitle className="text-orange-700">Payment Account Required</AlertTitle>
      <AlertDescription className="text-orange-600">
        <p className="mb-3">
          To sell tickets, you need to connect a payment account. This allows you to receive 
          payments directly from ticket purchases.
        </p>
        <Button 
          variant="outline" 
          onClick={onSetupAccount}
          className="border-orange-300 bg-white text-orange-700 hover:bg-orange-100 hover:text-orange-800"
        >
          Set Up Payment Account
        </Button>
      </AlertDescription>
    </Alert>
  );
};
