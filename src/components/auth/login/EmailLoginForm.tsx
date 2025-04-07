
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface EmailLoginFormProps {
  isLoading: boolean;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ isLoading }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLocalLoading(true);
      console.log('Attempting email login with:', { email });
      
      const success = await login('email', { 
        email, 
        password 
      });
      
      if (!success) {
        toast.error('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-medimemo-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading || localLoading}>
          {isLoading || localLoading ? "Logging in..." : "Log in"}
        </Button>
      </div>
    </form>
  );
};

export default EmailLoginForm;
