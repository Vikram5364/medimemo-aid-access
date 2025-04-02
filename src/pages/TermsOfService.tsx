
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
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
              <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
              <p className="text-gray-500">Last updated: April 2, 2025</p>
            </div>
            
            <div className="prose max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to MediMemo. By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
              
              <h2>2. Description of Service</h2>
              <p>
                MediMemo provides a secure, Aadhaar-integrated medical records management platform for individuals and healthcare providers in India. The service allows users to store, manage, and share medical records with authorized healthcare providers.
              </p>
              
              <h2>3. Aadhaar Integration</h2>
              <p>
                MediMemo uses Aadhaar-based authentication as a secure means of verifying identity. By using MediMemo, you consent to the verification of your identity through your Aadhaar number and/or biometric data in accordance with the Aadhaar Act, 2016 and related regulations.
              </p>
              
              <h2>4. User Accounts</h2>
              <p>
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. Users must immediately notify MediMemo of any unauthorized use of their account.
              </p>
              
              <h2>5. Privacy and Data Protection</h2>
              <p>
                We take your privacy seriously. All personal and medical information is encrypted and stored securely. Our data handling practices comply with relevant Indian laws and regulations, including the Digital Personal Data Protection Act, 2023.
              </p>
              
              <h2>6. Emergency Access</h2>
              <p>
                MediMemo provides an emergency access feature that allows healthcare providers to access critical medical information in emergency situations. Users acknowledge that in emergency situations, healthcare providers may access their medical information through biometric verification without explicit consent at the time of emergency, but with full audit trailing and notification.
              </p>
              
              <h2>7. User Conduct</h2>
              <p>
                Users agree not to use the service for any illegal or unauthorized purpose. Users are responsible for ensuring that all information provided is accurate and up-to-date.
              </p>
              
              <h2>8. Healthcare Provider Access</h2>
              <p>
                Healthcare providers must register and verify their credentials to access patient records. Providers agree to access patient records only with proper authorization or in emergency situations.
              </p>
              
              <h2>9. Modifications to Service</h2>
              <p>
                MediMemo reserves the right to modify or discontinue the service at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
              
              <h2>10. Limitation of Liability</h2>
              <p>
                MediMemo is not liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use of the service or any other matter relating to the service.
              </p>
              
              <h2>11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts in India.
              </p>
              
              <h2>12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@medimemo.in
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
