
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        navigate('/settings/billing');
        return;
      }

      try {
        setLoading(true);
        
        // Verify the checkout session with our backend
        const { data, error } = await supabase.functions.invoke('verify-subscription', {
          body: { sessionId }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data.success) {
          setVerified(true);
          toast.success('Your subscription has been activated!');
        } else {
          throw new Error('Unable to verify subscription');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Failed to verify your subscription', { 
          description: 'Please contact customer support for assistance'
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  const handleContinue = () => {
    navigate('/settings/billing');
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            <h1 className="text-2xl font-bold">Verifying your subscription...</h1>
            <p className="text-gray-600">This will only take a moment.</p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Subscription Activated!</h1>
            <p className="text-gray-600">
              Thank you for your subscription. Your account has been upgraded and all premium features are now available.
            </p>
            <Button 
              onClick={handleContinue} 
              className="mt-6 bg-purple-600 hover:bg-purple-700"
            >
              Continue to Billing Dashboard
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-600">
              We couldn't verify your subscription. If you believe this is an error, please contact our support team.
            </p>
            <Button 
              onClick={handleContinue} 
              variant="outline"
            >
              Return to Billing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
