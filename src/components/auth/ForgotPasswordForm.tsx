
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          {!resetSent 
            ? 'Enter your email to receive password reset instructions' 
            : 'Check your email for reset instructions'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!resetSent ? (
          <form onSubmit={handleResetPassword}>
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending instructions..." : "Send Reset Instructions"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
            <p className="text-green-800 mb-4">
              If an account exists with email <span className="font-semibold">{email}</span>, 
              you'll receive password reset instructions shortly.
            </p>
            <p className="text-sm text-gray-600">
              Please check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          <Link 
            to="/login" 
            className="text-center text-sm text-medimemo-primary hover:underline"
          >
            Back to Login
          </Link>
          <p className="text-xs text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-medimemo-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
