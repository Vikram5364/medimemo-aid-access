
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="medimemo-container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Activity size={28} className="text-medimemo-primary" />
              <span className="font-bold text-xl text-medimemo-primary">MediMemo</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center flex-1 mx-10">
                <div className="relative w-full max-w-lg">
                  <Input
                    type="text"
                    placeholder="Search medical records..."
                    className="pl-10 pr-4 py-2 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
                <Link to="/emergency-access">
                  <Button variant="destructive" size="sm">Emergency Access</Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={24} />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>

        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex items-center mb-4">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search medical records..."
                  className="pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Link to="/dashboard" className="text-gray-600 hover:text-medimemo-primary py-2">
                Dashboard
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-medimemo-primary py-2">
                My Profile
              </Link>
              <Link to="/emergency-access" className="text-red-600 hover:text-red-800 py-2">
                Emergency Access
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
