
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, hardcoded successful login
      if (loginMethod === 'email' && email && password) {
        toast.success('Login successful');
        navigate('/dashboard');
      } else if (loginMethod === 'aadhaar' && aadhaar) {
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    }, 1500);
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Biometric authentication successful');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login to MediMemo</CardTitle>
        <CardDescription className="text-center">
          Access your medical records securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" onValueChange={setLoginMethod}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleLogin}>
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="aadhaar">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    className="pl-10"
                    value={aadhaar}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      let formattedValue = '';
                      
                      for (let i = 0; i < value.length && i < 12; i++) {
                        if (i > 0 && i % 4 === 0) {
                          formattedValue += ' ';
                        }
                        formattedValue += value[i];
                      }
                      
                      setAadhaar(formattedValue);
                    }}
                    maxLength={14}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="button" 
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading || !aadhaar || aadhaar.replace(/\s/g, '').length !== 12}
                >
                  {isLoading ? "Verifying..." : "Verify with OTP"}
                </Button>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleBiometricAuth}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Fingerprint className="mr-2" size={18} />
                  {isLoading ? "Authenticating..." : "Use Biometric Authentication"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-600 w-full">
          Don't have an account?{" "}
          <Link to="/register" className="text-medimemo-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
