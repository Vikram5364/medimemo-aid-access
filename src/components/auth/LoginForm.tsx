
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, Mail, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { verifyFingerprint, scanFingerprint } from '@/utils/fingerprint-utils';
import FingerprintScanAnimation, { ScanStatus } from './FingerprintScanAnimation';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [userType, setUserType] = useState('individual');
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleIndividualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      try {
        const success = await login('email', { 
          email, 
          password 
        });
        
        if (success) {
          toast.success('Login successful');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } else if (loginMethod === 'aadhaar') {
      if (otpSent) {
        // Handle OTP verification
        try {
          // Format Aadhaar by removing spaces
          const formattedAadhaar = aadhaar.replace(/\s/g, '');
          
          const success = await login('aadhaar', { 
            aadhaar: formattedAadhaar,
            otp
          });
          
          if (success) {
            toast.success('Aadhaar verification successful');
            navigate('/dashboard');
          } else {
            toast.error('Invalid OTP. Please try again.');
          }
        } catch (error) {
          console.error('OTP verification error:', error);
          toast.error('OTP verification failed. Please try again.');
        }
      } else {
        // Send OTP
        if (!aadhaar || aadhaar.replace(/\s/g, '').length !== 12) {
          toast.error('Please enter a valid 12-digit Aadhaar number');
          return;
        }
        
        try {
          toast.info('Sending OTP to your registered mobile number');
          // Simulate OTP sending
          await new Promise(resolve => setTimeout(resolve, 1500));
          setOtpSent(true);
          toast.success('OTP sent successfully');
        } catch (error) {
          console.error('OTP sending error:', error);
          toast.error('Failed to send OTP. Please try again.');
        }
      }
    }
  };

  const handleOrganizationLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login('organization', {
        orgId,
        password: orgPassword
      });
      
      if (success) {
        toast.success('Organization login successful');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Organization login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const handleBiometricAuth = () => {
    setScanStatus('scanning');
    setIsBiometricLoading(true);
    
    // Simulate fingerprint scanning with timeout
    setTimeout(async () => {
      try {
        // Scan any finger
        const scannedFingerprint = await scanFingerprint('right_index');
        
        // Verify the fingerprint
        const isVerified = await verifyFingerprint(scannedFingerprint);
        
        if (isVerified) {
          setScanStatus('success');
          
          // Show success before navigating
          setTimeout(async () => {
            const success = await login('biometric', {});
            
            if (success) {
              toast.success('Biometric authentication successful');
              navigate('/dashboard');
            } else {
              setScanStatus('error');
              toast.error('Failed to authenticate with biometrics');
            }
            
            setIsBiometricLoading(false);
          }, 1000);
        } else {
          setScanStatus('error');
          toast.error('Fingerprint verification failed');
          setIsBiometricLoading(false);
        }
      } catch (error) {
        console.error('Biometric authentication error:', error);
        setScanStatus('error');
        toast.error('Failed to authenticate with biometrics');
        setIsBiometricLoading(false);
      }
    }, 2000);
  };

  // Reset the scan status to idle
  const resetScanStatus = () => {
    setScanStatus('idle');
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
                  {!otpSent ? (
                    <>
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
                      
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={handleIndividualLogin}
                        disabled={isLoading || !aadhaar || aadhaar.replace(/\s/g, '').length !== 12}
                      >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="relative">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="6-digit OTP"
                            className="pl-3"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 6) {
                                setOtp(value);
                              }
                            }}
                            maxLength={6}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          OTP sent to your registered mobile number
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setOtpSent(false)}
                        >
                          Back
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={handleIndividualLogin}
                          disabled={isLoading || otp.length !== 6}
                        >
                          {isLoading ? "Verifying..." : "Verify OTP"}
                        </Button>
                      </div>
                    </>
                  )}
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>
                  
                  {scanStatus === 'idle' ? (
                    <Button 
                      type="button" 
                      onClick={handleBiometricAuth}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading || isBiometricLoading}
                    >
                      <Fingerprint className="mr-2" size={18} />
                      Use Fingerprint Authentication
                    </Button>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <FingerprintScanAnimation 
                        status={scanStatus} 
                        onScan={scanStatus === 'error' ? resetScanStatus : handleBiometricAuth} 
                      />
                    </div>
                  )}
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
