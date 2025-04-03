
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, ArrowLeft, ArrowRight, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/use-user-profile';
import { FingerPosition, FingerprintData, fingerPositionNames, fingerPositionOrder, scanFingerprint, saveFingerprints } from '@/utils/fingerprint-utils';

const FingerprintEnrollment: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [fingerprints, setFingerprints] = useState<FingerprintData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningFinger, setScanningFinger] = useState<FingerPosition | null>(null);
  const [progress, setProgress] = useState(0);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const totalSteps = fingerPositionOrder.length;

  useEffect(() => {
    // Calculate progress
    setProgress((fingerprints.length / totalSteps) * 100);
    
    // Check if enrollment is complete
    if (fingerprints.length === totalSteps) {
      setEnrollmentComplete(true);
    }
  }, [fingerprints, totalSteps]);

  const handleFingerScan = async () => {
    if (isScanning || currentStep >= totalSteps) return;

    const fingerPosition = fingerPositionOrder[currentStep];
    setIsScanning(true);
    setScanningFinger(fingerPosition);

    try {
      // Simulate scanning process
      toast.info(`Scanning ${fingerPositionNames[fingerPosition]}`);
      
      // Call the scanning function
      const fingerprintData = await scanFingerprint(fingerPosition);
      
      // Add to collected fingerprints
      setFingerprints(prev => [...prev, fingerprintData]);
      
      // Show success message
      toast.success(`${fingerPositionNames[fingerPosition]} scanned successfully`);
      
      // Move to next step
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      toast.error(`Failed to scan ${fingerPositionNames[fingerPosition]}`);
      console.error('Fingerprint scan error:', error);
    } finally {
      setIsScanning(false);
      setScanningFinger(null);
    }
  };

  const handleSave = () => {
    if (fingerprints.length !== totalSteps) {
      toast.error('Please scan all fingerprints before saving');
      return;
    }

    // Get user identifier
    const userId = profile?.id || localStorage.getItem('userEmail') || localStorage.getItem('userAadhaar') || 'unknown';
    
    // Save the fingerprints
    const saveSuccess = saveFingerprints(userId, fingerprints);
    
    if (saveSuccess) {
      toast.success('Fingerprints saved successfully');
      setTimeout(() => {
        navigate('/profile'); // Redirect to profile page
      }, 1500);
    } else {
      toast.error('Failed to save fingerprints');
    }
  };

  const resetEnrollment = () => {
    setCurrentStep(0);
    setFingerprints([]);
    setEnrollmentComplete(false);
    setProgress(0);
  };

  return (
    <div className="medimemo-container py-8">
      <Link 
        to="/profile" 
        className="inline-flex items-center text-sm font-medium text-medimemo-primary mb-6 hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Fingerprint Enrollment</h1>
        <p className="text-gray-500 mt-1">
          Enroll your fingerprints for secure biometric authentication
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fingerprint className="mr-2 h-5 w-5 text-medimemo-primary" />
            Fingerprint Registration
          </CardTitle>
          <CardDescription>
            Please follow the instructions to register all your fingerprints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{fingerprints.length} of {totalSteps} fingerprints</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Current finger to scan */}
          {!enrollmentComplete ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Fingerprint 
                  className={`h-12 w-12 ${isScanning ? 'text-medimemo-primary animate-pulse' : 'text-gray-400'}`} 
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {isScanning ? 'Scanning in progress...' : `Scan your ${fingerPositionNames[fingerPositionOrder[currentStep]]}`}
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                {isScanning 
                  ? 'Please keep your finger steady on the scanner' 
                  : 'Place your finger on the scanner and press the scan button'}
              </p>
              <Button 
                className="mt-6" 
                onClick={handleFingerScan} 
                disabled={isScanning || enrollmentComplete}
              >
                {isScanning ? 'Scanning...' : 'Scan Fingerprint'}
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Check className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Enrollment Complete!
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                All fingerprints have been successfully scanned and are ready to be saved
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button variant="outline" onClick={resetEnrollment}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Restart Enrollment
                </Button>
                <Button onClick={handleSave}>
                  Save Fingerprints
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Fingerprint list */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium text-sm">Enrolled Fingerprints</h3>
            </div>
            <div className="p-1">
              <div className="grid grid-cols-2 gap-1">
                {fingerPositionOrder.map((position, index) => {
                  const isEnrolled = fingerprints.some(f => f.position === position);
                  const isActive = currentStep === index && !enrollmentComplete;
                  
                  return (
                    <div 
                      key={position} 
                      className={`flex items-center p-2 rounded ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 
                        isEnrolled ? 'bg-green-50 border border-green-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {isEnrolled ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Fingerprint className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                        </div>
                      )}
                      <span className={`ml-2 text-sm ${
                        isActive ? 'font-medium text-blue-700' : 
                        isEnrolled ? 'font-medium text-green-700' : 
                        'text-gray-500'
                      }`}>
                        {fingerPositionNames[position]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Enrollment tips */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Tips for successful enrollment</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure your fingers are clean and not too dry or wet</li>
                    <li>Place your finger flat on the scanner</li>
                    <li>Keep your finger still during scanning</li>
                    <li>Apply moderate pressure - not too light or heavy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4 bg-gray-50">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
          {enrollmentComplete && (
            <Button onClick={handleSave}>
              Save and Complete
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FingerprintEnrollment;
