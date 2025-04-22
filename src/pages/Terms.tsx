
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the EventIt platform, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            EventIt provides an event planning and management platform that allows users to create, 
            organize, and manage events. The specific features and functionality may change over time.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>
            To use certain features of the service, you must register for an account. 
            You are responsible for maintaining the confidentiality of your account and password 
            and for restricting access to your computer. You agree to accept responsibility for 
            all activities that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain 
            information, text, graphics, or other material. You retain any and all rights to any content 
            you submit, post or display on or through the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
          <p>
            Certain aspects of the service may be provided for a fee. You will be required to select a 
            payment plan and provide accurate information regarding your payment method. You agree to pay 
            all fees in accordance with the payment plan you select.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the 
            exclusive property of EventIt and its licensors. The service is protected by copyright, 
            trademark, and other laws of both the United States and foreign countries.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall EventIt, nor its directors, employees, partners, agents, suppliers, or 
            affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for 
            any reason whatsoever, including without limitation if you breach the Terms. Upon termination, 
            your right to use the service will immediately cease.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, 
            without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By 
            continuing to access or use our service after those revisions become effective, you agree to be 
            bound by the revised terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@eventit.com.
          </p>
        </section>
      </div>
      
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Terms;
