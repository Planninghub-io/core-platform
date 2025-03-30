
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to EventIt. These Terms of Service govern your use of our website, 
            applications, and services. By using EventIt, you agree to these terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
          <p>
            When you create an account with us, you must provide accurate and complete 
            information. You are responsible for safeguarding the password and for all 
            activities that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p>
            Our platform allows you to create and share event information. You are 
            responsible for the content you post and must ensure it doesn't violate any laws 
            or infringe on third-party rights.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p>
            The service and all content and materials available through it are the property 
            of EventIt or its licensors and are protected by copyright, trademark, and other 
            intellectual property laws.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Privacy</h2>
          <p>
            Our Privacy Policy describes how we handle the information you provide to us when 
            you use our services. By using EventIt, you consent to our collection and use of 
            your data as described in our Privacy Policy.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p>
            We may terminate or suspend your account at any time, without prior notice or 
            liability, for any reason, including breach of these Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. If we make changes, we 
            will provide notice through our website or by other means.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@eventit.com.
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
