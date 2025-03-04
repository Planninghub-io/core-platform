
import { useState } from "react";
import { X, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PriceSummaryProps {
  price: number | null;
  hasBookingFee?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  price,
  hasBookingFee = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const formattedPrice = `$${(price || 0).toFixed(2)}`;
  const bookingFee = hasBookingFee ? 0.00 : 0; // We'll set this to 0 for now

  if (!isVisible) return null;

  return (
    <Card className="bg-sky-50 border-0 p-4 relative mb-4">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close summary"
      >
        <X size={18} />
      </button>
      
      <h3 className="text-lg font-medium mb-4">Summary</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Buyer will pay</p>
          <p className="text-xl font-semibold">{formattedPrice}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Selling fees</p>
          <p className="text-sm">0 trial credits + {formattedPrice}</p>
          <div className="flex items-center mt-1 text-gray-400 text-sm">
            <span>Estimated average fees</span>
            <Info size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};
