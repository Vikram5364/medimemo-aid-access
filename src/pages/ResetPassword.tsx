
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <ResetPasswordForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
