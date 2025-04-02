
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, FileText, Shield, Fingerprint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
          <div className="medimemo-container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Your Medical Records, Secured with Aadhaar
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-md">
                  MediMemo provides secure, Aadhaar-integrated medical records management for emergency healthcare access in India.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/emergency-access">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Emergency Access
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-xl p-6 md:ml-6 relative">
                  <div className="absolute -top-4 -right-4 bg-medimemo-primary text-white rounded-full p-2">
                    <Activity size={24} />
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Medical Records Dashboard" 
                    className="rounded-lg shadow-sm"
                  />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-gray-900">100%</p>
                      <p className="text-xs text-gray-500">Secure</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-gray-900">24/7</p>
                      <p className="text-xs text-gray-500">Access</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-gray-900">Aadhaar</p>
                      <p className="text-xs text-gray-500">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="medimemo-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                MediMemo provides everything you need to securely manage your medical records with Aadhaar integration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Fingerprint className="h-6 w-6 text-medimemo-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aadhaar Integration</h3>
                <p className="text-gray-600">
                  Securely link your medical records to your Aadhaar identity for verified access in emergencies.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-medimemo-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Management</h3>
                <p className="text-gray-600">
                  Organize, store, and access your medical documents in a secure, Google Drive-like interface.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-medimemo-error" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Access</h3>
                <p className="text-gray-600">
                  Allow healthcare providers to access critical medical information during emergencies.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="medimemo-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Simple steps to secure your medical records with Aadhaar verification
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-medimemo-primary text-white flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Register with Aadhaar</h3>
                <p className="text-gray-600 text-sm">
                  Create an account using your Aadhaar for secure identity verification
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-medimemo-primary text-white flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <p className="text-gray-600 text-sm">
                  Scan and upload your medical records, prescriptions, and reports
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-medimemo-primary text-white flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Organize Records</h3>
                <p className="text-gray-600 text-sm">
                  Categorize your medical documents in a structured, searchable format
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-medimemo-primary text-white flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Access Anywhere</h3>
                <p className="text-gray-600 text-sm">
                  Securely access your records from any device, anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-medimemo-primary text-white">
          <div className="medimemo-container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold">Ready to Secure Your Medical Records?</h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of Indians who trust MediMemo with their medical information
              </p>
              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="mr-4">
                    Register Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-medimemo-primary">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
