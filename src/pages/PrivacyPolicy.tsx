
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="medimemo-container">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: April 2, 2025</p>
            </div>
            
            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                MediMemo is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              
              <h2>2. Information We Collect</h2>
              <p>
                We collect the following categories of information:
              </p>
              <ul>
                <li><strong>Personal Information:</strong> Name, contact information, date of birth, gender, and other demographic information.</li>
                <li><strong>Aadhaar Information:</strong> Aadhaar reference ID (not the actual Aadhaar number) and biometric verification data.</li>
                <li><strong>Medical Information:</strong> Medical records, health history, medications, allergies, and other health-related data.</li>
                <li><strong>Emergency Contact Information:</strong> Contact details for individuals you designate for emergency situations.</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including access logs and device information.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>
                We use your information for the following purposes:
              </p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To allow healthcare providers to access your medical information with your consent or in emergencies</li>
                <li>To verify your identity using Aadhaar-based authentication</li>
                <li>To send notifications about your account and service updates</li>
                <li>To improve our service and develop new features</li>
                <li>To comply with legal obligations</li>
              </ul>
              
              <h2>4. Data Security</h2>
              <p>
                We implement robust security measures to protect your information:
              </p>
              <ul>
                <li>End-to-end encryption for all sensitive data</li>
                <li>Secure storage of biometric templates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security audits and assessments</li>
                <li>Compliance with industry security standards</li>
              </ul>
              
              <h2>5. Aadhaar Data Handling</h2>
              <p>
                MediMemo complies with all UIDAI guidelines regarding Aadhaar data:
              </p>
              <ul>
                <li>We do not store your actual Aadhaar number, only a reference ID</li>
                <li>Biometric data is only used for authentication purposes and not stored permanently</li>
                <li>All Aadhaar-related transactions are logged and auditable</li>
                <li>Your explicit consent is obtained for Aadhaar authentication</li>
              </ul>
              
              <h2>6. Sharing Your Information</h2>
              <p>
                We may share your information with:
              </p>
              <ul>
                <li>Healthcare providers with your consent or in emergency situations</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Government authorities when required by law</li>
              </ul>
              
              <h2>7. Emergency Access</h2>
              <p>
                In medical emergencies, healthcare providers may access your critical medical information through biometric verification. All emergency access is logged, and you will be notified of such access.
              </p>
              
              <h2>8. Your Rights</h2>
              <p>
                You have the following rights regarding your information:
              </p>
              <ul>
                <li>Access and review your personal and medical information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and associated data</li>
                <li>View logs of who has accessed your information</li>
                <li>Withdraw consent for sharing your information</li>
              </ul>
              
              <h2>9. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you services. We may retain certain data for longer periods if required by law or for legitimate business purposes.
              </p>
              
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@medimemo.in
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
