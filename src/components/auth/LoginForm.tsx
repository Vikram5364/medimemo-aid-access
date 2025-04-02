
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, Mail, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('individual');
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIndividualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process for individuals
    setTimeout(() => {
      setIsLoading(false);
      
      if (loginMethod === 'email' && email && password) {
        // Store user information in localStorage to simulate a real login
        localStorage.setItem('userType', 'individual');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else if (loginMethod === 'aadhaar' && aadhaar) {
        // Store user information in localStorage to simulate a real login
        localStorage.setItem('userType', 'individual');
        localStorage.setItem('userAadhaar', aadhaar);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    }, 1500);
  };

  const handleOrganizationLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate organization login process
    setTimeout(() => {
      setIsLoading(false);
      
      if (orgId && orgPassword) {
        // Store organization information in localStorage
        localStorage.setItem('userType', 'organization');
        localStorage.setItem('orgId', orgId);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Organization login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid organization credentials. Please try again.');
      }
    }, 1500);
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    
    // Simulate fingerprint verification that uses stored fingerprint data
    setTimeout(() => {
      setIsLoading(false);
      
      // Get fingerprint from local storage if it exists (this would be set during registration)
      const fingerprints = localStorage.getItem('userFingerprints');
      
      if (fingerprints) {
        localStorage.setItem('userType', 'individual');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'biometric');
        
        toast.success('Biometric authentication successful');
        navigate('/dashboard');
      } else {
        toast.error('Biometric data not found. Please register or use another login method.');
      }
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
        <Tabs defaultValue="individual" onValueChange={setUserType}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="organization">Hospital/Organization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual">
            <Tabs defaultValue="email" onValueChange={setLoginMethod}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleIndividualLogin}>
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
                      onClick={handleIndividualLogin}
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
          </TabsContent>
          
          <TabsContent value="organization">
            <form onSubmit={handleOrganizationLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgId">Organization ID</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="orgId"
                      type="text"
                      placeholder="Organization ID"
                      className="pl-10"
                      value={orgId}
                      onChange={(e) => setOrgId(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="orgPassword">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-medimemo-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="orgPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Organization Log in"}
                </Button>
              </div>
            </form>
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
