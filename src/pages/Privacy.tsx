
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or 
            modify your account, request services, contact customer support, or otherwise 
            communicate with us. This information may include your name, email address, 
            phone number, and other contact or identifying information.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            to process and complete transactions, and to send you related information, including 
            confirmations, notices, updates, and security alerts.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
          <p>
            We may share personal information with third-party service providers to help us 
            operate our business and the site or administer activities on your behalf. We may 
            also disclose your information where required to do so by law or subpoena.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p>
            We use commercially reasonable technical and organizational measures to protect 
            your personal information. However, no method of transmission over the Internet 
            or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>
            You have the right to access personal information we hold about you and to ask 
            that your personal information be corrected, updated, or deleted. If you would 
            like to exercise these rights, please contact us.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our 
            service and hold certain information. You can instruct your browser to refuse 
            all cookies or to indicate when a cookie is being sent.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the "Last 
            Updated" date at the top of this Privacy Policy.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@eventit.com.
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

export default Privacy;
