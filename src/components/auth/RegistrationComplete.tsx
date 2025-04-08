
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFingerprintList } from '@/utils/fingerprint-scan-utils';
import { FingerprintData } from '@/utils/fingerprint-utils';
import { toast } from 'sonner';

interface RegistrationCompleteProps {
  fingerprints: FingerprintData[];
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({ 
  fingerprints, 
  onComplete, 
  onBack,
  isLoading
}) => {
  const fingerprintsCount = fingerprints.length;
  const fingerprintsSummary = formatFingerprintList(fingerprints);
  
  const handleComplete = () => {
    // Ensure at least one fingerprint is enrolled
    if (fingerprintsCount === 0) {
      toast.error("Please enroll at least one fingerprint before completing registration.");
      onBack(); // Go back to fingerprint enrollment
      return;
    }
    onComplete();
  };
  
  return (
    <div className="space-y-6 text-center">
      <div>
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-xl font-medium">Ready to Complete Registration</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {fingerprintsCount > 0 
            ? `You've successfully enrolled ${fingerprintsCount} fingerprints.` 
            : "You need to enroll at least one fingerprint."}
        </p>
        {fingerprintsCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {fingerprintsSummary}
          </p>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <p>Click "Complete Registration" to create your account.</p>
        {fingerprintsCount === 0 && (
          <p className="mt-2 text-red-600">At least one fingerprint is required for registration.</p>
        )}
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={handleComplete} 
          className="w-full" 
          disabled={isLoading || fingerprintsCount === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="w-full"
        >
          Back to Form
        </Button>
      </div>
    </div>
  );
};

export default RegistrationComplete;
