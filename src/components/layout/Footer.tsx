
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="medimemo-container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-medimemo-primary">MediMemo</h3>
            <p className="text-sm text-gray-600">
              Secure, Aadhaar-integrated medical records management system for emergency healthcare access in India.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-medimemo-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-medimemo-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-medimemo-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/emergency-access" className="text-sm text-gray-600 hover:text-medimemo-primary">
                  Emergency Access
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-medimemo-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-medimemo-primary">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-medimemo-primary" />
                <span>+91 123-456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-medimemo-primary" />
                <span>support@medimemo.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} MediMemo. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
