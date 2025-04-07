
import React, { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import FingerprintScanAnimation, { ScanStatus } from '../FingerprintScanAnimation';
import { verifyFingerprint, scanFingerprint } from '@/utils/fingerprint-utils';

interface AadhaarLoginFormProps {
  isLoading: boolean;
}

const AadhaarLoginForm: React.FC<AadhaarLoginFormProps> = ({ isLoading }) => {
  const { login } = useAuth();
  const [aadhaar, setAadhaar] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpSent) {
      // Handle OTP verification
      try {
        // Format Aadhaar by removing spaces
        const formattedAadhaar = aadhaar.replace(/\s/g, '');
        
        console.log('Verifying OTP for Aadhaar:', { aadhaar: formattedAadhaar, otp });
        
        const success = await login('aadhaar', { 
          aadhaar: formattedAadhaar,
          otp
        });
        
        if (success) {
          toast.success('Aadhaar verification successful');
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
            onClick={handleAadhaarSubmit}
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
              onClick={handleAadhaarSubmit}
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
  );
};

export default AadhaarLoginForm;
