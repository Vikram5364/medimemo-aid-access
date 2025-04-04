
import React, { useState } from 'react';
import { Check, Fingerprint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  FingerPosition, 
  FingerprintData, 
  scanFingerprint, 
  fingerPositionNames,
  fingerPositionOrder
} from '@/utils/fingerprint-utils';
import FingerprintScanAnimation, { ScanStatus } from './FingerprintScanAnimation';

interface FingerprintEnrollmentProps {
  onComplete: (fingerprints: FingerprintData[]) => void;
  onSkip: () => void;
}

const FingerprintEnrollment: React.FC<FingerprintEnrollmentProps> = ({ onComplete, onSkip }) => {
  const [fingerprints, setFingerprints] = useState<FingerprintData[]>([]);
  const [currentFingerStep, setCurrentFingerStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningFinger, setScanningFinger] = useState<FingerPosition | null>(null);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [lastScannedQuality, setLastScannedQuality] = useState<number | undefined>(undefined);
  
  const totalFingerSteps = fingerPositionOrder.length;

  // Auto scan the next fingerprint after a successful scan
  const scanNextFingerprint = async () => {
    if (currentFingerStep >= totalFingerSteps) {
      return;
    }
    
    await handleFingerScan();
    
    // If we have more fingerprints to scan and the last scan was successful,
    // automatically start the next scan after a short delay
    if (fingerprints.length > 0 && currentFingerStep < totalFingerSteps) {
      setTimeout(() => {
        if (currentFingerStep < totalFingerSteps) {
          scanNextFingerprint();
        }
      }, 1500);
    }
  };

  // Handle fingerprint scan
  const handleFingerScan = async () => {
    if (isScanning || currentFingerStep >= totalFingerSteps) return;

    const fingerPosition = fingerPositionOrder[currentFingerStep];
    setIsScanning(true);
    setScanningFinger(fingerPosition);
    setScanStatus('scanning');

    try {
      // Simulate scanning process with improved animation timing
      toast.info(`Scanning ${fingerPositionNames[fingerPosition]}`);
      
      // Simulate a longer scan for better animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the scanning function
      const fingerprintData = await scanFingerprint(fingerPosition);
      setLastScannedQuality(fingerprintData.quality);
      
      // Add to collected fingerprints
      setFingerprints(prev => [...prev, fingerprintData]);
      
      // Show success feedback
      setScanStatus('success');
      toast.success(`${fingerPositionNames[fingerPosition]} scanned successfully`);
      
      // Move to next step after showing success feedback
      setTimeout(() => {
        if (currentFingerStep < totalFingerSteps - 1) {
          setCurrentFingerStep(prev => prev + 1);
          setScanStatus('idle');
          setLastScannedQuality(undefined);
        }
        
        // Update progress
        setFingerprintProgress(((currentFingerStep + 1) / totalFingerSteps) * 100);
      }, 1500);
      
    } catch (error) {
      setScanStatus('error');
      toast.error(`Failed to scan ${fingerPositionNames[fingerPosition]}`);
      console.error('Fingerprint scan error:', error);
      
      // Reset after error feedback
      setTimeout(() => {
        setScanStatus('idle');
      }, 1500);
    } finally {
      setIsScanning(false);
      setScanningFinger(null);
    }
  };

  // Reset fingerprints
  const resetFingerprints = () => {
    setFingerprints([]);
    setCurrentFingerStep(0);
    setFingerprintProgress(0);
    setScanStatus('idle');
    setLastScannedQuality(undefined);
  };

  // Start auto-scanning all fingerprints
  const startAutoScan = () => {
    resetFingerprints();
    scanNextFingerprint();
  };

  // Complete the fingerprint enrollment process
  const handleComplete = () => {
    onComplete(fingerprints);
  };

  const currentFingerPosition = currentFingerStep < totalFingerSteps 
    ? fingerPositionNames[fingerPositionOrder[currentFingerStep]] 
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Fingerprint Enrollment</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Register your fingerprints for faster and more secure authentication
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Progress</span>
          <span>{fingerprints.length} of {totalFingerSteps} fingerprints</span>
        </div>
        <Progress value={(fingerprints.length / totalFingerSteps) * 100} className="h-2" />
      </div>
      
      {/* Current finger to scan with enhanced animation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
        <FingerprintScanAnimation 
          status={scanStatus} 
          fingerPosition={currentFingerPosition}
          quality={lastScannedQuality}
        />
        
        {fingerprints.length >= totalFingerSteps ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="outline" onClick={resetFingerprints}>
              Reset Fingerprints
            </Button>
            <Button onClick={handleComplete} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              Complete Registration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="outline" onClick={onSkip}>
              Skip for Now
            </Button>
            {fingerprints.length === 0 ? (
              <Button
                onClick={startAutoScan}
                disabled={isScanning}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isScanning ? 'Scanning...' : 'Start Scanning All Fingerprints'}
              </Button>
            ) : (
              <Button
                onClick={handleFingerScan}
                disabled={isScanning || scanStatus !== 'idle'}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isScanning ? 'Scanning...' : 'Scan Next Fingerprint'}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Fingerprint list */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-medium text-sm">Enrolled Fingerprints</h3>
        </div>
        <div className="p-1">
          <div className="grid grid-cols-2 gap-1">
            {fingerPositionOrder.map((position, index) => {
              const isEnrolled = fingerprints.some(f => f.position === position);
              const isActive = currentFingerStep === index && fingerprints.length < totalFingerSteps;
              
              return (
                <div 
                  key={position} 
                  className={cn(
                    "flex items-center p-2 rounded transition-all duration-300",
                    isActive ? "bg-blue-50 border border-blue-200 shadow-sm" : 
                    isEnrolled ? "bg-green-50 border border-green-200" : 
                    "bg-gray-50 border border-gray-200"
                  )}
                >
                  {isEnrolled ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Fingerprint className={cn(
                        "h-4 w-4",
                        isActive ? "text-blue-500" : "text-gray-400",
                        isActive && scanStatus === 'scanning' && "animate-pulse"
                      )} />
                    </div>
                  )}
                  <span className={cn(
                    "ml-2 text-sm",
                    isActive ? "font-medium text-blue-700" : 
                    isEnrolled ? "font-medium text-green-700" : 
                    "text-gray-500"
                  )}>
                    {fingerPositionNames[position]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintEnrollment;
