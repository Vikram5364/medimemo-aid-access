
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegistrationCompleteProps {
  fingerprintsCount: number;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({ 
  fingerprintsCount, 
  onComplete, 
  onBack,
  isLoading
}) => {
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
            : "You've skipped fingerprint enrollment."}
        </p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <p>Click "Complete Registration" to create your account.</p>
        {fingerprintsCount === 0 && (
          <p className="mt-2">You can enroll your fingerprints later from your profile page.</p>
        )}
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={onComplete} 
          className="w-full" 
          disabled={isLoading}
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
