
import React from 'react';

interface CheckoutNoticeProps {
  isPaid: boolean;
  directCheckout: boolean;
}

const CheckoutNotice = ({ isPaid, directCheckout }: CheckoutNoticeProps) => {
  return (
    <>
      <p className="text-sm text-center text-gray-500 mt-4">
        Your subscription will begin immediately after payment processing.
        {isPaid && " You'll be redirected to our secure payment provider to complete your purchase."}
      </p>
      
      {directCheckout && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800">Payment Processor Notice</h3>
          <p className="text-sm text-amber-700 mt-1">
            Our primary payment processor may be experiencing issues. The "Try Alternative Payment" button will use our backup system.
          </p>
        </div>
      )}
    </>
  );
};

export default CheckoutNotice;
